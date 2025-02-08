// using FSC.Application.Models.Dots.Assignments.FlightClearanceAssignments.Response;
// using FSC.Application.Models.Dots.Assignments.FlightScheduleMajorTasks.Response;
// using FSC.Application.Models.Dots.Master.Positions;
// using FSC.Application.Models.Dots.Master.SubTasks;
// using FSC.Application.Models.Dtos.Approvals.Response;
// using FSC.Application.Models.Dtos.Assignments.FlightScheduleMajorTasks.Response;
// using FSC.Application.Models.Dtos.Master.Employees;
// using FSC.Application.Models.Dtos.Master.FlightSchedules;
// using FSC.Application.Models.Dtos.Master.MajorTasks;
// using FSC.Application.Models.Dtos.Master.SubTasks;
// using FSC.Domain.Models.Approvals;
// using FSC.Domain.Models.Assignment;
// using FSC.Domain.Models.Master;
//
// namespace FSC.Application.Mappers;
//
// public static class Mapper
// {
//     public static FlightScheduleDetailDto MapFlightScheduleDetailDto(FlightSchedule flightSchedule)
//     {
//         return new FlightScheduleDetailDto
//         {
//             Id = flightSchedule.Id,
//             
//             FlightNumber = flightSchedule.FlightNumber,
//             FlightLegReferenceNumber = flightSchedule.FlightLegReferenceNumber,
//             ActualBlockOff = flightSchedule.ActualBlockOff,
//             ActualBlockOn = flightSchedule.ActualBlockOn,
//             AircraftType = flightSchedule.AircraftType,
//             ScheduledDepartureTime = flightSchedule.ScheduledDepartureTime,
//             ScheduledArrivalTime = flightSchedule.ScheduledArrivalTime,
//             Carrier = flightSchedule.Carrier,
//             Suffix = flightSchedule.Suffix,
//             LatestArrival = flightSchedule.LatestArrival,
//             LatestDeparture = flightSchedule.LatestDeparture,
//             EstimatedBlockOff = flightSchedule.EstimatedBlockOff,
//             EstimatedBlockOn = flightSchedule.EstimatedBlockOn,
//             AircraftRegistration = flightSchedule.AircraftRegistration,
//             PreviousTail = flightSchedule.PreviousTail,
//             DepartureGate = flightSchedule.DepartureGate,
//             Status = flightSchedule.Status,
//             DepartureParkingStand = flightSchedule.DepartureParkingStand,
//             ArrivalGate = flightSchedule.ArrivalGate,
//             ArrivalParkingStand = flightSchedule.ArrivalParkingStand,
//             Tail = flightSchedule.Tail,
//             
//             RegisteredDate = flightSchedule.RegisteredDate,
//             LastUpdateDate = flightSchedule.LastUpdateDate,
//             RecordStatus = flightSchedule.RecordStatus,
//         };
//     }
//
//     public static MajorTaskDetailDto MapMajorTaskDetailDto(MajorTask majorTask)
//     {
//         return new MajorTaskDetailDto
//         {
//             Id = majorTask.Id,
//             Name = majorTask.Name,
//             Description = majorTask.Description,
//             RecordStatus = majorTask.RecordStatus,
//         };
//     }
//
//     public static SubTaskDetailDto MapSubTaskDetailDto(SubTask subTask)
//     {
//         return new SubTaskDetailDto()
//         {
//             Id = subTask.Id,
//             Name = subTask.Name,
//             Description = subTask.Description,
//             RecordStatus = subTask.RecordStatus
//         };
//     }
//
//     public static PositionDetailDto? MapPositionDetailDto(Position? position)
//     {
//         if (position == null)
//         {
//             return null;
//         }
//
//         return new PositionDetailDto()
//         {
//             Id = position.Id,
//             Name = position.Name,
//             Description = position.Description,
//             RecordStatus = position.RecordStatus
//         };
//     }
//
//     public static EmployeeDetailDto? MapEmployeeDetailDto(Employee? employee)
//     {
//         if (employee == null)
//         {
//             return null;
//         }
//
//         return new EmployeeDetailDto()
//         {
//             Id = employee.Id,
//             EmployeeId = employee.EmployeeId,
//             FirstName = employee.FirstName,
//             MiddleName = employee.MiddleName,
//             LastName = employee.LastName,
//             Email = employee.Email,
//             Shift = employee.Shift,
//             FirstSupId = employee.FirstSupId,
//             PositionId = employee.PositionId,
//             RecordStatus = employee.RecordStatus,
//             Position = MapPositionDetailDto(employee.Position)
//         };
//     }
//
//
//     public static MajorFlightTaskAssignmentResponseDto? MapMajorFlightTaskAssignmentDto(
//         MajorFlightTaskAssignment? majorTaskAssignment)
//     {
//         if (majorTaskAssignment is null) return null;
//         return new MajorFlightTaskAssignmentResponseDto()
//         {
//             AssignmentId = majorTaskAssignment.Id,
//             AssignedEmployee = MapEmployeeDetailDto(majorTaskAssignment.SecurityTeamLeader)
//         };
//     }
//
//     public static SubTaskAssignmentResponseDto? MapSubTaskAssignmentDto(FlightClearanceAssignment? assignment)
//     {
//         if (assignment is null) return null;
//
//         return new SubTaskAssignmentResponseDto()
//         {
//             Id = assignment.Id,
//             TaskStatus = assignment.TaskStatus,
//             Remark = assignment.Remark,
//             AssignedToEmployee = MapEmployeeDetailDto(assignment.AssignedToEmployee),
//             RecordStatus = assignment.RecordStatus
//         };
//     }
//
//     public static ApprovalDetailDto? MapApprovalDetailDto(ApprovalLog? approval)
//     {
//         if (approval == null)
//         {
//             return null;
//         }
//
//         return new ApprovalDetailDto()
//         {
//             Id = approval.Id,
//             MajorFlightTaskAssignmentId = approval.MajorFlightTaskAssignmentId,
//             EmployeeId = approval.EmployeeId,
//             Employee = approval.Employee,
//             Action = approval.Action,
//             Remark = approval.Remark,
//             RegisteredDate = approval.RegisteredDate,
//             LastUpdateDate = approval.LastUpdateDate,
//             RecordStatus = approval.RecordStatus,
//         };
//     }
//     
//     public static ApprovalLogResponse? MapApprovalLogResponseDto(ApprovalLog? approval)
//     {
//         if (approval == null)
//         {
//             return null;
//         }
//
//         return new ApprovalLogResponse()
//         {
//             Id = approval.Id,
//             MajorFlightTaskAssignmentId = approval.MajorFlightTaskAssignmentId,
//             EmployeeId = approval.EmployeeId,
//             Employee = MapEmployeeDetailDto(approval.Employee)!,
//             Action = approval.Action,
//             Remark = approval.Remark,
//             RecordStatus = approval.RecordStatus,
//             RegisteredDate = approval.RegisteredDate,
//             LastUpdateDate = approval.LastUpdateDate
//         };
//     }
// }