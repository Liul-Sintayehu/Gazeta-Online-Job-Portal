using FSC.Domain.Helpers;
using FSC.Domain.Validator.Notifications;

namespace FSC.Domain.Models.Notifications
{
    public class Notification : BaseEntity
    {
        public string UserName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public NotificationCategory Category { get; set; }
        public NotificationNature Nature { get; set; }
        public NotificationType Type { get; set; }
        public string LinkToTask { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime? ReadTime { get; set; }

        public static Notification Create(string userName, string subject, NotificationCategory category, NotificationNature nature,
            NotificationType type, string message, string linkToTask)
        {
            var notification = new Notification
            {
                UserName = userName,
                Subject = subject,
                Category = category,
                Nature = nature,
                Type = type,
                Message = message,
                LinkToTask = linkToTask,
            };

            var validator = new NotificationValidator();
            var response = validator.Validate(notification);

            if (response.IsValid)
            {
                notification.Register();
                return notification;
            }

            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }

        public static Notification CreateOnEmailSent(string userName, string subject, string message, NotificationCategory category)
        {
            var notification = new Notification
            {
                UserName = userName,
                Subject = subject,
                Category = category,
                Nature = NotificationNature.InEmail,
                Type = NotificationType.Warning,
                Message = message,
                LinkToTask = string.Empty,
            };

            notification.Register();
            return notification;
        }
        public void Update(string userName, string subject, NotificationCategory category, NotificationNature nature,
            NotificationType type, string message, string linkToTask, bool isRead, DateTime? readTime)
        {
            UserName = userName;
            Subject = subject;
            Category = category;
            Nature = nature;
            Type = type;
            Message = message;
            LinkToTask = linkToTask;
            IsRead = isRead;
            ReadTime = readTime;

            var validator = new NotificationValidator();
            var response = validator.Validate(this);
            if (response.IsValid)
            {
                UpdateAudit();
                return;
            }

            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }

        public void ReadNotification()
        {
            if (IsRead) return;
            
            IsRead = true;
            ReadTime = Helper.GetDateTimeNow();
        }
    }
}
