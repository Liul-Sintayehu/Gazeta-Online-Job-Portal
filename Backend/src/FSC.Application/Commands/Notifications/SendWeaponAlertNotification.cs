using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;

namespace FSC.Application.Commands.Notifications;

public record SendWeaponAlertNotificationCommand(FlightSchedule FlightSchedule):IRequest<bool>;

internal class SendWeaponAlertNotificationCommandHandler(
    IRepositoryBase<Notification> notificationRepo,
    IRepositoryBase<Employee> employeeRepo
    ):IRequestHandler<SendWeaponAlertNotificationCommand, bool>
{
    public async Task<bool> Handle(SendWeaponAlertNotificationCommand request, CancellationToken cancellationToken)
    {
        var teamLeaders = await employeeRepo.Where(em => 
            em.Position.Name.Contains("team leader")
            && em.RecordStatus != RecordStatus.Deleted)
            .ToListAsync(cancellationToken);
        
        var notifications =
            teamLeaders.Select(teamLeader => CreateWeaponAlertNotification(request.FlightSchedule, teamLeader)).ToList();
        
        var isSuccessfullySent = await notificationRepo.AddRangeAsync(notifications);
        
        return isSuccessfullySent;
    }

    private static Notification CreateWeaponAlertNotification(FlightSchedule flightSchedule, Employee employee)
    {
        var subject = $"Alert: Weapon Alert Handling [{flightSchedule.Carrier}-{flightSchedule.FlightNumber}]";
        var message = $"""
                       Dear {employee.FirstName}, 
                                     
                       Weapon alert is sent for a Flight Number {flightSchedule.Carrier}-{flightSchedule.FlightNumber} on an aircraft {flightSchedule.AircraftType} with a tail {flightSchedule.AircraftRegistration} that flies From: {flightSchedule.LatestDeparture} => To: {flightSchedule.LatestArrival}. 
                       
                       Please assign a responsible officer to handle the weapons on time!
                       
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