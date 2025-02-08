using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;

namespace FSC.Application.Commands.Notifications;

public record SendWeaponHandlingAssignmentNotificationCommand(FlightSchedule FlightSchedule, Employee AssignedEmployee)
    : IRequest<bool>;

internal class SendWeaponHandlingAssignmentNotificationCommandHandler(
    IRepositoryBase<Notification> notificationRepo
) : IRequestHandler<SendWeaponHandlingAssignmentNotificationCommand, bool>
{
    public async Task<bool> Handle(SendWeaponHandlingAssignmentNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = CreateWeaponAlertNotification(request.FlightSchedule, request.AssignedEmployee);
        
        var isSuccessfullySent = await notificationRepo.AddAsync(notification);
        
        return isSuccessfullySent;
    }
    
    private static Notification CreateWeaponAlertNotification(FlightSchedule flightSchedule, Employee employee)
    {
        var subject = $"Alert: Weapon Alert Handling Assignment [{flightSchedule.Carrier}-{flightSchedule.FlightNumber}]";
        var message = $"""
                       Dear {employee.FirstName}, 
                                     
                       You have been assigned to handle the weapon alert that is sent for a Flight Number {flightSchedule.Carrier}-{flightSchedule.FlightNumber} on an aircraft {flightSchedule.AircraftType} with a tail {flightSchedule.AircraftRegistration} that flies From: {flightSchedule.LatestDeparture} => To: {flightSchedule.LatestArrival}. 

                       Please attend to your task on time!

                       Thank you!  
                       """;

        return Notification.Create(
            userName: employee.EmployeeId,
            subject: subject,
            message: message,
            category: NotificationCategory.WeaponAlert,
            nature: NotificationNature.InApp,
            type: NotificationType.Warning,
            linkToTask: $"weapon-alert/{flightSchedule.Id}"
        );
    }
}