namespace FSC.Application.Models.Dtos.Notifications.Response;

public class NotificationListResponseDto
{
    public long Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public NotificationType Type { get; set; }
    public bool IsRead { get; set; }
    public DateTime RegisteredDate { get; set; }
}