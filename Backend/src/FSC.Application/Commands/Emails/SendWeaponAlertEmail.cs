using System.Text;
using FSC.Application.Services.Helper;
using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;
using FSC.Domain.Models.WeaponAlert;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FSC.Application.Commands.Emails;

public record SendWeaponAlertEmailCommand(List<Weapon> Weapons, FlightSchedule FlightSchedule, string? Remark)
    : IRequest<OperationResult<bool>>;

internal class SendWeaponAlertEmailCommandHandler(
    IRepositoryBase<Notification> notificationRepo,
    IConfiguration configuration,
    IEmailSender emailSender,
    ILogger<SendWeaponAlertEmailCommandHandler> logger)
    : IRequestHandler<SendWeaponAlertEmailCommand, OperationResult<bool>>
{
    public async Task<OperationResult<bool>> Handle(SendWeaponAlertEmailCommand request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<bool>();

        try
        {
            var flight = request.FlightSchedule;
            var weapons = request.Weapons;
            
            var isEmailSentToSecurity = await SendEmailToSecurity(flight, weapons, request.Remark);
            
            if (isEmailSentToSecurity)
            {   
                // Filtering transit weapons for customer care teams alert email 
                var transitWeapons = weapons.Where(w => w.IsTransit).ToList();
                if (transitWeapons.Count > 0)
                {
                    await SendEmailToCustomerCare(flight, transitWeapons);
                }

                result.Payload = true;
                result.Message = "Alert email sent successfully!";
            }
            else
            {
                result.AddError(ErrorCode.ServerError, "Failed to send the alert email.");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while sending weapon alert email.");
            result.AddError(ErrorCode.UnknownError, ex.Message);
        }

        return result;
    }

    private async Task<bool> SendEmailToSecurity(FlightSchedule flight, List<Weapon> weapons, string? remark)
    {
            // Craft the email subject
            var subject = $"[Alert] Registered Weapons on Flight {flight.Carrier}-{flight.FlightNumber}";

            // Craft the email body in a tabular format
            var emailBody = new StringBuilder();
            emailBody.Append("<html><body>");

            emailBody.Append("<h2 style='color:red;'>⚠️ Weapon Alert Notification ⚠️</h2>");
            emailBody.Append("<p>This is an automated alert for registered weapons on the following flight:</p>");

            emailBody.Append($"<p><strong>Flight Number:</strong> {flight.Carrier}-{flight.FlightNumber}</p>");
            emailBody.Append($"<p><strong>Aircraft Type:</strong> {flight.AircraftType}</p>");
            emailBody.Append($"<p><strong>Aircraft Registration:</strong> {flight.AircraftRegistration}</p>");
            emailBody.Append($"<p><strong>From :</strong> {flight.LatestDeparture} </p>");
            emailBody.Append($"<p><strong>Departures On:</strong> {flight.ScheduledDepartureTime} </p>");
            emailBody.Append($"<p><strong>To:</strong> {flight.LatestArrival} </p>");
            emailBody.Append($"<p><strong>Arrives On:</strong> {flight.ScheduledArrivalTime} </p>");

            emailBody.Append("<br />");
            emailBody.Append("<br />");

            emailBody.Append("<table border='1' cellpadding='5' cellspacing='0' style='border-collapse:collapse;'>");
            emailBody.Append(
                "<thead><tr><th>Weapon Tag Number</th><th>Palate Number</th><th>AKENumber</th><th>Remark</th></tr></thead><tbody>");
            foreach (var weapon in weapons)
                emailBody.Append(
                    $"<tr> <td>{weapon.TagNumber}</td> <td>{weapon.PalateNumber}</td> <td>{weapon.AKENumber}</td> <td>{weapon.Remark}</td> </tr>");
            emailBody.Append("</tbody></table>");

            if (!string.IsNullOrEmpty(remark))
            {
                emailBody.Append($"<br />");
                emailBody.Append($"<strong>Remark: </strong> {remark}");
            }

            emailBody.Append("</body></html>");
            
            // Weapon Alert Recipient
            var emailRecipient = configuration["EmailSettings:WeaponAlertRecipient"] ?? "";

            var isEmailSent = await emailSender.SendEmailAsync(
                emailBody.ToString(),
                subject,
                null,
                [emailRecipient],
                null,
                null
            );

            if (!isEmailSent) return isEmailSent;
            
            var notification = Notification.CreateOnEmailSent(emailRecipient, subject, emailBody.ToString(),
                NotificationCategory.WeaponAlert);
            await notificationRepo.AddAsync(notification);

            return isEmailSent;
    }
    
    private async Task<bool> SendEmailToCustomerCare(FlightSchedule flight, List<Weapon> weapons)
    {
            // Craft the email subject
            var subject = $"[Alert] Transit Passenger(s) with Weapon on Flight {flight.Carrier}-{flight.FlightNumber}";

            // Craft the email body in a tabular format
            var emailBody = new StringBuilder();
            emailBody.Append("<html><body>");

            emailBody.Append("<h2>⚠️ Weapon Alert Notification ⚠️</h2>");
            emailBody.Append("<p>This is an automated alert for registered weapons of transit passenger(s) on the following flight:</p>");

            emailBody.Append($"<p><strong>Flight Number:</strong> {flight.Carrier}-{flight.FlightNumber}</p>");
            emailBody.Append($"<p><strong>Aircraft Type:</strong> {flight.AircraftType}</p>");
            emailBody.Append($"<p><strong>Aircraft Registration:</strong> {flight.AircraftRegistration}</p>");
            emailBody.Append($"<p><strong>From :</strong> {flight.LatestDeparture} </p>");
            emailBody.Append($"<p><strong>Departures On:</strong> {flight.ScheduledDepartureTime} </p>");
            emailBody.Append($"<p><strong>To:</strong> {flight.LatestArrival} </p>");
            emailBody.Append($"<p><strong>Arrives On:</strong> {flight.ScheduledArrivalTime} </p>");

            emailBody.Append("<br />");
            emailBody.Append("<br />");

            emailBody.Append("<table border='1' cellpadding='5' cellspacing='0' style='border-collapse:collapse;'>");
            emailBody.Append(
                "<thead><tr><th>Weapon Tag Number</th><th>Palate Number</th><th>AKENumber</th><th>Transit Passenger Name</th><th>Ticket Number</th> <th>Contact</th><th>Remark</th></tr></thead><tbody>");
            
            foreach (var weapon in weapons)
                emailBody.Append(
                    $"<tr> <td>{weapon.TagNumber}</td> <td>{weapon.PalateNumber}</td> <td>{weapon.AKENumber}</td> <td>{weapon.TransitPassengerName}</td> <td>{weapon.TicketNumber}</td> <td>{weapon.Contact}</td> <td>{weapon.Remark}</td> </tr> ");
            
            emailBody.Append("</tbody></table>");
            
            emailBody.Append("</body></html>");


            // Customer Care Group Email - Recipient
            var emailRecipient = configuration["EmailSettings:CustomerCareRecipient"] ?? "";

            var isEmailSent = await emailSender.SendEmailAsync(
                emailBody.ToString(),
                subject,
                null,
                [emailRecipient],
                null,
                null
            );

            if (!isEmailSent) return isEmailSent;
            
            var notification = Notification.CreateOnEmailSent(emailRecipient, subject, emailBody.ToString(),
                NotificationCategory.WeaponAlert);
            await notificationRepo.AddAsync(notification);
            return isEmailSent;
    }
}