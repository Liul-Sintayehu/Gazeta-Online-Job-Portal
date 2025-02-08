using FSC.Domain.Models.Notifications;

namespace FSC.Application.Queries.Notifications;

public record GetDetailNotificationByIdQuery(long Id) : IRequest<OperationResult<Notification>>;

internal class GetDetailNotificationByIdQueryHandler(
    IRepositoryBase<Notification> notificationRepo
) : IRequestHandler<GetDetailNotificationByIdQuery, OperationResult<Notification>>
{
    public async Task<OperationResult<Notification>> Handle(GetDetailNotificationByIdQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<Notification>();

        var notification = await notificationRepo.Where(n =>
            n.Id == request.Id
            && n.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (notification is null)
        {
            result.AddError(ErrorCode.NotFound, "Notification not found!");
            return result;
        }

        notification.ReadNotification();

        await notificationRepo.UpdateAsync(notification);
        result.Payload = notification;
        return result;
    }
}
