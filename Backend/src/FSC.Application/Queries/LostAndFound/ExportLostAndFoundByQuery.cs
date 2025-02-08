using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Domain.Models.LostAndFound;
using OfficeOpenXml;

namespace FSC.Application.Queries.LostAndFound;

public record ExportLostAndFoundByQuery(GetLostAndFoundItemsQueryDto Dto) : IRequest<OperationResult<byte[]>>;

internal class ExportLostAndFoundByQueryHandler(IMediator mediator)
    : IRequestHandler<ExportLostAndFoundByQuery, OperationResult<byte[]>>
{
    public async Task<OperationResult<byte[]>> Handle(ExportLostAndFoundByQuery request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<byte[]>();

        try
        {
            //  To avoid pagination
            request.Dto.PageSize = null;
            request.Dto.PageNumber = null;

            var lostAndFoundItemsResult =
                await mediator.Send(new GetAllLostAndFoundItem(request.Dto), cancellationToken);
            if (lostAndFoundItemsResult.IsError)
            {
                lostAndFoundItemsResult.Errors.ToList().ForEach(error => result.Errors.Add(error));
                return result;
            }

            var lostAndFoundOrdered = lostAndFoundItemsResult.Payload;
            if (lostAndFoundOrdered.Count == 0)
            {
                result.AddError(ErrorCode.ValidationError, "No lost and found items to export.");
                return result;
            }

            lostAndFoundOrdered.Reverse();
            var excelFile = await ExportToExcel(lostAndFoundOrdered, request.Dto.StartFoundDate,
                request.Dto.EndFoundDate, cancellationToken);

            result.Payload = excelFile;
        }
        catch (NotValidException nve)
        {
            nve.ValidationErrors.ForEach(vf => result.AddError(ErrorCode.ValidationError, vf));
        }
        catch (Exception ex)
        {
            result.AddError(ErrorCode.ServerError, ex.Message);
        }

        return result;
    }

    private static async Task<byte[]> ExportToExcel(
        List<LostAndFoundItem> lostAndFoundItems,
        DateTime startFoundDate,
        DateTime? endFoundDate,
        CancellationToken cancellationToken)
    {
        const int headerRow = 3; // The row where column headers start
        const int startRow = headerRow + 1; // The row where data starts

        // Generate the header message
        var headerMessage = endFoundDate.HasValue
            ? $"Between {startFoundDate:MM/dd/yyyy} and {endFoundDate.Value:MM/dd/yyyy}."
            : $"On {startFoundDate:MM/dd/yyyy}.";

        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Lost and Found Items");

        // Merge and style the title rows
        worksheet.Cells[1, 1, 1, 13].Merge = true; // Merge for the first row
        worksheet.Cells[2, 1, 2, 13].Merge = true; // Merge for the second row

        worksheet.Cells[1, 1].Value = "Ethiopian Airlines Group Security";
        worksheet.Cells[2, 1].Value = $"Lost and Found Items Reported {headerMessage}";

        using (var headerRange = worksheet.Cells[1, 1, 2, 13])
        {
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.Size = 14;
            headerRange.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            headerRange.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
        }

        // Add record header row
        var headers = new[]
        {
            "No", "Reference No.", "Flight No.", "Aircraft Type", "Item Name", "Item Type",
            "Found Location", "Number of Items", "Price", "Received By", "Shift",
            "Receipt No.", "Confirmation", "Security Officer Name", "Security Officer Id", "Registered Date", "Recorded By"
        };

        // Adding the headers
        for (var col = 1; col <= headers.Length; col++) worksheet.Cells[headerRow, col].Value = headers[col - 1];

        // Style the headers
        using (var headerRange = worksheet.Cells[headerRow, 1, headerRow, headers.Length])
        {
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.Size = 12;
            headerRange.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
            headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
            headerRange.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
            headerRange.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
            headerRange.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
            headerRange.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
        }

        // Add data rows
        for (var i = 0; i < lostAndFoundItems.Count; i++)
        {
            var item = lostAndFoundItems[i];
            var row = startRow + i;

            worksheet.Cells[row, 1].Value = i + 1;
            worksheet.Cells[row, 2].Value = item.ReferenceNumber;
            worksheet.Cells[row, 3].Value = item.FlightNumber;
            worksheet.Cells[row, 4].Value = item.AircraftType;
            worksheet.Cells[row, 5].Value = item.ItemName;
            worksheet.Cells[row, 6].Value = item.Category;
            worksheet.Cells[row, 7].Value = item.FoundLocation;
            worksheet.Cells[row, 8].Value = item.Amount;
            worksheet.Cells[row, 9].Value = item.Price;
            worksheet.Cells[row, 10].Value = item.AgentName;
            worksheet.Cells[row, 11].Value = item.Shift;
            worksheet.Cells[row, 12].Value = item.ReceiptNumber;
            worksheet.Cells[row, 13].Value = string.IsNullOrEmpty(item.ConfirmationSignature) ? "Not Signed" : "Signed";
            worksheet.Cells[row, 14].Value = item.SecurityOfficerName;
            worksheet.Cells[row, 15].Value = item.SecurityOfficerId;
            worksheet.Cells[row, 16].Value = item.RegisteredDate.ToString("MM/dd/yyyy");
            worksheet.Cells[row, 17].Value =
                $"{item.RecordedByOfficer.FirstName} {item.RecordedByOfficer.MiddleName} {item.RecordedByOfficer.LastName}";
        }

        // Auto-fit columns for readability
        worksheet.Cells.AutoFitColumns();

        // Convert the Excel package to a byte array
        return await package.GetAsByteArrayAsync(cancellationToken);
    }
}