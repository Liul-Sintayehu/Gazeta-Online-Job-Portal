namespace FSC.Application.Models.Dtos.Notifications.Response;

public class NotificationsPaginatedResponseDto
{
    public List<NotificationListResponseDto> Notifications { get; set; } = [];
    public int TotalCount { get; set; }
    public int TotalUnreadCount { get; set; }
}