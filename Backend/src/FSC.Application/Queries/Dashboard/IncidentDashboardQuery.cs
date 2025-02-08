using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.IncidentHandling.Incidents;
using FSC.Domain.Models.IncidentHandling.Investigations;

namespace FSC.Application.Queries.Dashboard;

public record IncidentDashboardQuery(IncidentDashboardRequestDto Dto) : IRequest<OperationResult<List<IncidentDashboardResponseDto>>>;

internal class IncidentDashboardQueryHandler(
    IRepositoryBase<Incident> incidentRepo, 
    IRepositoryBase<Investigation> investigationRepo
) : IRequestHandler<IncidentDashboardQuery, OperationResult<List<IncidentDashboardResponseDto>>>
{
    public async Task<OperationResult<List<IncidentDashboardResponseDto>>> Handle(IncidentDashboardQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<IncidentDashboardResponseDto>>();
        
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

        var incidentQuery = incidentRepo.Where(i =>
            i.RecordStatus != RecordStatus.Deleted
            && i.RegisteredDate.Date >= startDate
            && i.RegisteredDate.Date <= endDate);
        var investigationsQuery = investigationRepo.Where(inv => 
            inv.RecordStatus != RecordStatus.Deleted
            && inv.Incident.RegisteredDate.Date >= startDate
            && inv.Incident.RegisteredDate.Date <= endDate);
        
        // Group incidents by category and count them
        var incidentCounts = await incidentQuery
            .GroupBy(i => i.IncidentCategory)
            .Select(group => new 
            {
                Category = group.Key,
                IncidentCount = group.Count()
            })
            .ToListAsync(cancellationToken);

        // Group investigations by incident category and count them
        var investigationCounts = await investigationsQuery
            .GroupBy(i => i.Incident.IncidentCategory)
            .Select(group => new 
            {
                Category = group.Key,
                InvestigationCount = group.Count()
            })
            .ToListAsync(cancellationToken);

        // Map incidents and investigations into the response DTO
        var incidentCategories = Enum.GetValues(typeof(IncidentCategory)).Cast<IncidentCategory>();
        
        var incidentLists = (from category in incidentCategories
            let incidentCount = incidentCounts.FirstOrDefault(ic => ic.Category == category)?.IncidentCount ?? 0
            let investigationCount = investigationCounts.FirstOrDefault(ic => ic.Category == category)?.InvestigationCount ?? 0
            select new IncidentDashboardResponseDto()
            {
                Incident = category.ToString().Replace("Incident", ""), // You can map this to a user-friendly string if needed
                Count = incidentCount,
                Investigation = investigationCount
            }).ToList();

        result.Payload = incidentLists;
        return result;
    }
}