namespace FSC.Application.Models.Dtos.Notifications.Response;

public class NotificationDetailResponseDto
{
    public long Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationCategory Category { get; set; }
    public NotificationNature Nature { get; set; }
    public NotificationType Type { get; set; }
    public string LinkToTask { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadTime { get; set; }
    public DateTime RegisteredDate { get; set; }
    public DateTime LastUpdateDate { get; set; }
}