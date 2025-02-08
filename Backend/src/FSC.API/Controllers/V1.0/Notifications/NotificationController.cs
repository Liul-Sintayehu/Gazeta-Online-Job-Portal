using FSC.API.Controllers.Common;
using FSC.Application.Models.Dtos.Notifications.Response;
using FSC.Application.Queries.Notifications;

namespace FSC.API.Controllers.V1._0.Notifications;

public class NotificationController : BaseController
{
    [HttpGet("{userName}")]
    public async Task<IActionResult> GetNotifications(
        [FromRoute] string userName,
        [FromQuery] int? pageNumber,
        [FromQuery] int? pageSize,
        [FromQuery] bool? isNotRead)
    {
        var result = await _mediator.Send(new GetNotificationsByUserNameQuery(userName, pageNumber, pageSize, isNotRead));

        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }

    [HttpGet("Detail/{id:long}")]
    public async Task<IActionResult> GetNotificationDetail([FromRoute] long id)
    {
        var result = await _mediator.Send(new GetDetailNotificationByIdQuery(id));
        if (result.IsError) return HandleErrorResponse(result.Errors);

        var response = _mapper.Map<NotificationDetailResponseDto>(result.Payload);
        return Ok(response);
    }

    [HttpGet("GetUnreadCount/{userName}")]
    public async Task<IActionResult> GetUnreadCount([FromRoute] string userName)
    {
        var result = await _mediator.Send(new GetUnreadNotificationCountByUserNameQuery(userName.TrimStart('0')));

        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
}