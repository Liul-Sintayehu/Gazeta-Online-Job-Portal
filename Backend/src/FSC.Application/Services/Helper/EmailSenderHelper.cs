using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace FSC.Application.Services.Helper
{
    public interface IEmailSender
    {
        Task<bool> SendEmailAsync(string message, string subject, string? fileName, List<string>? toAddress, List<string>? ccAddress, byte[]? attachment);
    }

    public class EmailSenderService(IConfiguration configuration, ILogger<EmailSenderService> logger) : IEmailSender
    {
        public async Task<bool> SendEmailAsync(string message, string subject, string? fileName, List<string>? toAddress, List<string>? ccAddress, byte[]? attachment)
        {
            // Retrieve email keys from configuration
            var emailServer = configuration["EmailSettings:SmtpHost"];
            var emailSender = configuration["EmailSettings:FromEmail"] ?? "";
            var emailSenderName = configuration["EmailSettings:FromName"] ?? "";
            var emailPort = Convert.ToInt32(configuration["EmailSettings:SmtpPort"]);
            var emailPassword = configuration["EmailSettings:SmtpPassword"];

            if (toAddress == null || toAddress.Count == 0 || toAddress.All(string.IsNullOrEmpty))
            {
                logger.LogError("No recipient addresses provided.");
                return false;
            }

            try
            {
                var mail = CreateMailMessage(emailSender, emailSenderName, toAddress, ccAddress, subject, message, attachment, fileName);

                using SmtpClient smtp = new(emailServer, emailPort);
                smtp.Credentials = new NetworkCredential(emailSender, emailPassword);
                smtp.EnableSsl = true; // Ensure SSL is enabled
                smtp.Timeout = 60000; // Increased timeout for reliability

                smtp.DeliveryMethod = SmtpDeliveryMethod.Network; // Make sure delivery method is set to Network
                await smtp.SendMailAsync(mail);
                logger.LogInformation($"Email sent to {string.Join(", ", toAddress)}.");
                return true;
            }
            catch (SmtpException ex)
            {
                logger.LogError($"SMTP error sending email: {ex.Message}, InnerException: {ex.InnerException?.Message}, stacktrace: {ex.StackTrace}");
                return false;
            }
            catch (Exception ex)
            {
                logger.LogCritical($"Unexpected error sending email: {ex.Message}, InnerException: {ex.InnerException?.Message}, stacktrace: {ex.StackTrace}");
                return false;
            }
        }


        private static MailMessage CreateMailMessage(string sender, string senderName, List<string>? toAddress, List<string>? ccAddress, string subject, string message, byte[]? attachment, string? fileName)
        {
            var mail = new MailMessage
            {
                From = new MailAddress(sender, senderName),
                Subject = subject,
                Body = message,
                IsBodyHtml = true,
                Priority = MailPriority.High
            };

            if (toAddress != null)
                foreach (var to in toAddress)
                {
                    mail.To.Add(new MailAddress(to));
                }

            if (ccAddress != null && ccAddress.Count > 0)
            {
                foreach (var cc in ccAddress)
                {
                    mail.CC.Add(new MailAddress(cc));  // Correctly using CC
                }
            }

            mail.Bcc.Add("habtamuaw@ethiopianairlines.com");

            if (attachment == null) return mail;

            var attach = new Attachment(new MemoryStream(attachment), $"{fileName}.pdf", "application/pdf");
            mail.Attachments.Add(attach);

            return mail;
        }
    }
}
