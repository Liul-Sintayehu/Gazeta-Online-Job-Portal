using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.EmployeeAssignments;

namespace FSC.Application.Queries.Dashboard;

public record EscortDashboardQuery(EscortDashboardRequestDto Dto): IRequest<OperationResult<List<EscortDashboardResponseDto>>>;

internal class EscortDashboardQueryHandler(IRepositoryBase<Escort> escortRepo): IRequestHandler<EscortDashboardQuery, OperationResult<List<EscortDashboardResponseDto>>>
{
    public async Task<OperationResult<List<EscortDashboardResponseDto>>> Handle(EscortDashboardQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<EscortDashboardResponseDto>>();

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

        var escortsQuery = escortRepo.Where(inv =>
            inv.RecordStatus != RecordStatus.Deleted
            && inv.RegisteredDate.Date >= startDate
            && inv.RegisteredDate.Date <= endDate);

        var escortTypes = await escortsQuery
            .GroupBy(i => i.Type)
            .Select(group => new
            {
                Category = group.Key,
                EscortType = group.Count()
            })
            .ToListAsync(cancellationToken);

        var itemsCategory = Enum.GetValues(typeof(EscortType)).Cast<EscortType>();

        var escortList = (from type in itemsCategory
            let escortCount =
                escortTypes.FirstOrDefault(ic => ic.Category == type)?.EscortType ?? 0
            select new EscortDashboardResponseDto()
            {
                Type = type.ToString(),
                Count = escortCount
            }).ToList();

        result.Payload = escortList;
        
        return result;
    }
}