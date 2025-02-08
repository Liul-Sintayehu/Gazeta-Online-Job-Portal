using FSC.Application.Models.Dtos.Notifications.Response;
using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;
using Microsoft.AspNetCore.Http;

namespace FSC.Application.Queries.Notifications;

public record GetUnreadNotificationCountByUserNameQuery(string UserName)
    : IRequest<OperationResult<UnreadNotificationsResponseDto>>;

internal class GetUnreadNotificationCountByUserNameQueryHandler(
    IHttpContextAccessor httpContextAccessor,
    IRepositoryBase<Notification> notificationRepo,
    IRepositoryBase<Employee> employeeRepo
) : IRequestHandler<GetUnreadNotificationCountByUserNameQuery, OperationResult<UnreadNotificationsResponseDto>>
{
    public async Task<OperationResult<UnreadNotificationsResponseDto>> Handle(
        GetUnreadNotificationCountByUserNameQuery request, CancellationToken cancellationToken)
    {
        var userName = httpContextAccessor.HttpContext?.Session.GetString("user")?.TrimStart('0');
        var result = new OperationResult<UnreadNotificationsResponseDto>();
        var isEmployeeExists = await employeeRepo.Where(em =>
                em.EmployeeId == userName
                && em.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (isEmployeeExists == null)
        {
            var notFoundResponse = new UnreadNotificationsResponseDto()
            {
                UnreadNotificationsCount = 0,
                AllNotificationsCount = 0
            };

            result.Payload = notFoundResponse; ;
            return result;
        }

        var unreadNotificationsCount = await notificationRepo.Where(n =>
                n.UserName == request.UserName
                && !n.IsRead
                && n.RecordStatus != RecordStatus.Deleted)
            .CountAsync(cancellationToken);

        var allNotificationsCount = await notificationRepo.Where(n =>
                n.UserName == request.UserName
                && n.RecordStatus != RecordStatus.Deleted)
            .CountAsync(cancellationToken);
        
        var response = new UnreadNotificationsResponseDto()
        {
            UnreadNotificationsCount = unreadNotificationsCount,
            AllNotificationsCount = allNotificationsCount
        };

        result.Payload = response;

        result.Message = "Operation Successful!";
        return result;
    }
}