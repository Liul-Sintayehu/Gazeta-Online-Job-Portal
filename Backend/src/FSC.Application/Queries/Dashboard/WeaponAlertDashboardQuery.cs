using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.WeaponAlert;

namespace FSC.Application.Queries.Dashboard;

public record WeaponAlertDashboardQuery(WeaponAlertDashboardRequestDto Dto)
    : IRequest<OperationResult<WeaponAlertDashboardResponseDto>>;

internal class WeaponAlertDashboardQueryHandler(
    IRepositoryBase<WeaponHandling> weaponHandlingRepo,
    IRepositoryBase<Weapon> weaponRepo)
    : IRequestHandler<WeaponAlertDashboardQuery, OperationResult<WeaponAlertDashboardResponseDto>>
{
    public async Task<OperationResult<WeaponAlertDashboardResponseDto>> Handle(WeaponAlertDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<WeaponAlertDashboardResponseDto>();

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

        // Retrieve all weapons within the date range
        var totalWeapons = await weaponRepo
            .Where(w =>
                w.FlightScheduleId != null
                && w.RegisteredDate.Date >= startDate
                && w.RegisteredDate.Date <= endDate
                && w.RecordStatus == RecordStatus.Active)
            .CountAsync(cancellationToken);

        var weaponHandlingQuery = weaponHandlingRepo
            .Where(w =>
                w.IsSent == true
                && w.AlertSentOn.Date >= startDate
                && w.AlertSentOn.Date <= endDate
                && w.RecordStatus == RecordStatus.Active);

        var notAssigned = await weaponHandlingQuery.Where(wh =>
            wh.ResponsibleOfficerId == null)
            .CountAsync(cancellationToken);

        var assignedLate = await weaponHandlingQuery.Where(wh =>
            wh.FlightSchedule.ScheduledArrivalTime.HasValue &&
            wh.ResponsibleOfficerId.HasValue &&
            wh.FlightSchedule.ScheduledArrivalTime < wh.AssignedOn)
            .CountAsync(cancellationToken);

        var assignedOnTime = await weaponHandlingQuery.Where(wh =>
            wh.FlightSchedule.ScheduledArrivalTime.HasValue &&
            wh.ResponsibleOfficerId.HasValue &&
            wh.FlightSchedule.ScheduledArrivalTime >= wh.AssignedOn)
            .CountAsync(cancellationToken);
        
        result.Payload = new WeaponAlertDashboardResponseDto()
        {
            TotalWeapons = totalWeapons,
            OnTime = assignedOnTime,
            Late = assignedLate,
            NotAssigned = notAssigned
        };
        return result;
    }
}