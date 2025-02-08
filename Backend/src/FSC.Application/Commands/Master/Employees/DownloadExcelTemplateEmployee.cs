using System.Drawing;
using OfficeOpenXml;

namespace FSC.Application.Commands.Master.Employees
{
    public record DownloadExcelTemplateEmployee : IRequest<OperationResult<byte[]>>;
    internal class DownloadExcelTemplateEmployeeHandler : IRequestHandler<DownloadExcelTemplateEmployee, OperationResult<byte[]>>
    {
        public async Task<OperationResult<byte[]>> Handle(DownloadExcelTemplateEmployee request, CancellationToken cancellationToken)
        {
            var result = new OperationResult<byte[]>();
            
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Employees");
            worksheet.Cells[1, 1].Value = "Employee ID";
            worksheet.Cells[1, 2].Value = "First Name";
            worksheet.Cells[1, 3].Value = "Middle Name";
            worksheet.Cells[1, 4].Value = "Last Name";
            worksheet.Cells[1, 5].Value = "Email";
            worksheet.Cells[1, 6].Value = "Shift";
            worksheet.Cells[1, 7].Value = "First Supervisor ID";
            worksheet.Cells[1, 8].Value = "Position";

            worksheet.Row(1).Style.Font.Bold = true;
            worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            worksheet.Row(1).Style.Font.Size = 15;
            worksheet.Row(1).Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
            worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Green);
            worksheet.Row(1).Height = 17;
            worksheet.Cells.AutoFitColumns();
            
            var fileBytes = await package.GetAsByteArrayAsync(cancellationToken);

            result.Payload = fileBytes;
            result.Message = "Operation success";
            return result;
        }
    }
}
