using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.OffloadBaggages;

namespace FSC.Application.Queries.Dashboard;

public record OffloadBaggageDashboardQuery(OffloadBaggageDashboardRequestDto Dto): IRequest<OperationResult<List<OffloadBaggageDashboardResponseDto>>>;

internal class OffloadBaggageDashboardQueryHandler(IRepositoryBase<OffloadBaggage> offloadBaggageRepo): IRequestHandler<OffloadBaggageDashboardQuery, OperationResult<List<OffloadBaggageDashboardResponseDto>>>
{
    public async Task<OperationResult<List<OffloadBaggageDashboardResponseDto>>> Handle(OffloadBaggageDashboardQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<OffloadBaggageDashboardResponseDto>>();
        
        if (!request.Dto.RecordDate.HasValue)
        {
            result.AddError(ErrorCode.ValidationError, "Record Date is required.");
            return result;
        }

        // Determine date range based on RecordDate
        DateTime startDate, endDate = DateTime.UtcNow.Date;
        switch (request.Dto.RecordDate.Value)
        {
            case RecordDate.Today:
                startDate = DateTime.UtcNow.Date;
                break;
            case RecordDate.ThisWeek:
                startDate = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
                break;
            case RecordDate.ThisMonth:
                startDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
                break;
            case RecordDate.ThisYear:
                startDate = new DateTime(DateTime.UtcNow.Year, 1, 1);
                break;
            case RecordDate.LastYear:
                startDate = new DateTime(DateTime.UtcNow.Year - 1, 1, 1);
                endDate = new DateTime(DateTime.UtcNow.Year - 1, 12, 31);
                break;
            default:
                result.AddError(ErrorCode.ValidationError, "Invalid Record Date.");
                return result;
        }

        var offloadBaggageQuery = offloadBaggageRepo.Where(inv =>
            inv.RecordStatus != RecordStatus.Deleted
            && inv.RegisteredDate.Date >= startDate
            && inv.RegisteredDate.Date <= endDate);

        var offloadBaggageTypes = await offloadBaggageQuery
            .GroupBy(i => i.Category)
            .Select(group => new
            {
                Category = group.Key,
                OffloadBaggageCount = group.Count()
            })
            .ToListAsync(cancellationToken);

        var itemsCategory = Enum.GetValues(typeof(OffloadItemCategory)).Cast<OffloadItemCategory>();

        var offloadBaggageList = (from type in itemsCategory
            let offloadBaggageCount =
                offloadBaggageTypes.FirstOrDefault(ic => ic.Category == type)?.OffloadBaggageCount ?? 0
            select new OffloadBaggageDashboardResponseDto()
            {
                Type = type.ToString(),
                Count = offloadBaggageCount
            }).ToList();

        result.Payload = offloadBaggageList;
        return result;
    }
}