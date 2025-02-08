using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.IncidentHandling.Investigations;

namespace FSC.Application.Queries.Dashboard;

public record InvestigationDashboardQuery(InvestigationDashboardRequestDto Dto)
    : IRequest<OperationResult<List<InvestigationDashboardResponseDto>>>;

internal class InvestigationDashboardQueryHandler(IRepositoryBase<Investigation> investigationRepo)
    : IRequestHandler<InvestigationDashboardQuery, OperationResult<List<InvestigationDashboardResponseDto>>>
{
    public async Task<OperationResult<List<InvestigationDashboardResponseDto>>> Handle(
        InvestigationDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<InvestigationDashboardResponseDto>>();
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

        var investigationsQuery = investigationRepo.Where(inv =>
            inv.RecordStatus != RecordStatus.Deleted
            && inv.RegisteredDate.Date >= startDate
            && inv.RegisteredDate.Date <= endDate);

        var investigationCounts = await investigationsQuery
            .GroupBy(i => i.Status)
            .Select(group => new
            {
                Status = group.Key,
                InvestigationCount = group.Count()
            })
            .ToListAsync(cancellationToken);

        var taskStatus = Enum.GetValues(typeof(WorkTaskStatus)).Cast<WorkTaskStatus>();

        var incidentLists = (from status in taskStatus
            let investigationCount =
                investigationCounts.FirstOrDefault(ic => ic.Status == status)?.InvestigationCount ?? 0
            select new InvestigationDashboardResponseDto()
            {
                Status = status.ToString(),
                Count = investigationCount
            }).ToList();

        result.Payload = incidentLists;

        return result;
    }
}