using AutoMapper;
using FSC.Application.Models.Dtos.Notifications.Response;
using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;
using Microsoft.AspNetCore.Http;
namespace FSC.Application.Queries.Notifications;

public record GetNotificationsByUserNameQuery(string UserName, int? PageNumber, int? PageSize, bool? IsNotRead) : IRequest<OperationResult<NotificationsPaginatedResponseDto>>;

internal class GetNotificationsByUserNameQueryHandler(
     IHttpContextAccessor httpContextAccessor,
    IRepositoryBase<Notification> notificationRepo,
    IRepositoryBase<Employee> employeeRepo,
    IMapper mapper
) : IRequestHandler<GetNotificationsByUserNameQuery, OperationResult<NotificationsPaginatedResponseDto>>
{
    public async Task<OperationResult<NotificationsPaginatedResponseDto>> Handle(GetNotificationsByUserNameQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<NotificationsPaginatedResponseDto>();

        var userName = httpContextAccessor.HttpContext?.Session.GetString("user")?.TrimStart('0');

        var isEmployeeExists = await employeeRepo.Where(em =>
            em.EmployeeId == userName
            && em.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (isEmployeeExists == null)
        {

            result.Payload = new NotificationsPaginatedResponseDto()
            {
                Notifications = [],
                TotalCount = 0,
                TotalUnreadCount = 0
            };
            return result;
        }
        
        var allNotificationsQuery = notificationRepo.Where(n =>
            n.UserName == request.UserName
            && n.RecordStatus != RecordStatus.Deleted);

        if (request.IsNotRead.HasValue && request.IsNotRead.Value)
        {
            allNotificationsQuery = allNotificationsQuery.Where(n => n.IsRead == false);
        }
        
        if (request is { PageSize: > 0, PageNumber: > 0 })
        {
            var skip = (request.PageNumber.Value - 1) * request.PageSize.Value;
            
            allNotificationsQuery = allNotificationsQuery
                .OrderByDescending(n => n.RegisteredDate)
                .Skip(skip)
                .Take(request.PageSize.Value);
        }
        
        var allNotifications = await allNotificationsQuery.ToListAsync(cancellationToken);
        
        var totalCount = await notificationRepo
            .Where(n =>
                n.UserName == request.UserName
                && n.RecordStatus != RecordStatus.Deleted)
            .CountAsync(cancellationToken);
        
        var totalUnreadCount = await notificationRepo
            .Where(n =>
                n.UserName == request.UserName
                && n.IsRead == false
                && n.RecordStatus != RecordStatus.Deleted)
            .CountAsync(cancellationToken);

        result.Payload = new NotificationsPaginatedResponseDto()
        {
            Notifications = mapper.Map<List<NotificationListResponseDto>>(allNotifications),
            TotalCount = totalCount,
            TotalUnreadCount = totalUnreadCount
        };

        return result;
    }
}
