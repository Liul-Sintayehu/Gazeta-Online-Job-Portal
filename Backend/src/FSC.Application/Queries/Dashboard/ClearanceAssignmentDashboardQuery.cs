using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.Assignment;
using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Dashboard;

public record ClearanceAssignmentDashboardQuery(ClearanceAssignmentDashboardRequestDto Dto)
    : IRequest<OperationResult<ClearanceAssignmentDashboardResponseDto>>;

internal class ClearanceAssignmentDashboardQueryHandler(
    IRepositoryBase<FlightSchedule> flightScheduleRepo,
    IRepositoryBase<ClearanceAssignment> clearanceAssignmentRepo
) : IRequestHandler<ClearanceAssignmentDashboardQuery, OperationResult<ClearanceAssignmentDashboardResponseDto>>
{
    public async Task<OperationResult<ClearanceAssignmentDashboardResponseDto>> Handle(
        ClearanceAssignmentDashboardQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<ClearanceAssignmentDashboardResponseDto>();

        try
        {
            if (!request.Dto.DepartureDate.HasValue)
            {
                result.AddError(ErrorCode.ValidationError, "Departure Date is required");
                return result;
            }

            var specifiedDate = request.Dto.DepartureDate.Value.Date;

            // Query to get flight schedules matching the criteria
            var totalFlights = await flightScheduleRepo
                .Where(fs =>
                    fs.ScheduledDepartureTime != null &&
                    fs.ScheduledDepartureTime.Value.Date == specifiedDate &&
                    fs.RecordStatus == RecordStatus.Active)
                .CountAsync(cancellationToken);

            // Base query for clearance assignments
            var totalAssignmentsQuery = clearanceAssignmentRepo.Where(ca =>
                ca.SecurityTeamLeader != null &&
                ca.FlightSchedule.ScheduledDepartureTime != null &&
                ca.FlightSchedule.ScheduledDepartureTime.Value.Date == specifiedDate &&
                ca.FlightSchedule.RecordStatus == RecordStatus.Active);

            // Total assignments count
            var totalAssignmentsCount = await totalAssignmentsQuery.CountAsync(cancellationToken);

            if (totalAssignmentsCount <= 0)
            {
                // Populate the result
                result.Payload = new ClearanceAssignmentDashboardResponseDto
                {
                    AverageMinutes = 0,
                    ApprovedCount = 0,
                    AssignedCount = 0,
                    UnassignedCount = totalFlights 
                };
                return result;
            }
            
            // Total approved clearances
            var totalApprovedClearance = await totalAssignmentsQuery
                .Where(ca => ca.PilotApproval != null && ca.PilotApproval.Action == ApprovalAction.Approved)
                .CountAsync(cancellationToken);

            // Average time in minutes before departure when the pilot last updated
            var minutesBeforeDepartureList = await totalAssignmentsQuery
                .Where(ca => ca.PilotApproval != null && ca.PilotApproval.Action == ApprovalAction.Approved)
                .Select(ca => ca.FlightSchedule.ScheduledDepartureTime - ca.PilotApproval!.LastUpdateDate)
                .ToListAsync(cancellationToken);

            // Check if the list is empty before calculating the average
            var averageMinutesBeforeDeparture = minutesBeforeDepartureList.Any()
                ? minutesBeforeDepartureList
                    .Select(timeSpan => timeSpan?.TotalMinutes ?? 0)
                    .Average()
                : 0;
            
            // Populate the result
            result.Payload = new ClearanceAssignmentDashboardResponseDto
            {
                AverageMinutes = averageMinutesBeforeDeparture,
                ApprovedCount = totalApprovedClearance,
                AssignedCount = totalAssignmentsCount,
                UnassignedCount = totalFlights - totalAssignmentsCount
            };
        }
        catch (Exception e)
        {
            result.AddError(ErrorCode.UnknownError, e.Message);
        }

        return result;
    }
}