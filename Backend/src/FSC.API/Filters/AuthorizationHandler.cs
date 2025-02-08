using Microsoft.AspNetCore.Mvc.Controllers;

namespace FSC.API.Filters;

public class AuthorizationHandler(IHttpContextAccessor httpContextAccessor, IIdentityService identityService)
    : IAuthorizationFilter
{
    // Env Variable Handling
    private static readonly string? EnvironmentVariable = Environment.GetEnvironmentVariable("FSC");

    private static readonly long ServiceId =
        string.IsNullOrEmpty(EnvironmentVariable) ? 29 : Convert.ToInt64(EnvironmentVariable);

    public void OnAuthorization(AuthorizationFilterContext? context)
    {

        if (context == null)
        {
            return;
        }

        var httpContext = context.HttpContext;

        // Skip processing for OPTIONS (preflight) requests
        if (httpContext.Request.Method == HttpMethods.Options)
        {
            context.Result = new OkResult(); // Allow preflight requests to pass
            return;
        }

        if (context is { ActionDescriptor: ControllerActionDescriptor descriptor })
        {
            // get api resource
            var apiClaim = $"{descriptor.ControllerName}-{descriptor.ActionName}";

            if (_anonymous.Contains(apiClaim)) return;

            // get header values
            var serviceKey = context.HttpContext.Request.Headers["Servicekey"].ToString();
            var accessToken = context.HttpContext.Request.Headers["accessToken"].ToString();
            var idToken = context.HttpContext.Request.Headers["idToken"].ToString();
            var clientClaim = context.HttpContext.Request.Headers["clientClaim"].ToString();
            var organizationId = context.HttpContext.Request.Headers["OrganizationId"].ToString();

            if (string.IsNullOrEmpty(accessToken))
            {
                context.Result = new UnauthorizedObjectResult(new { message = "Access token is empty." });
                return;
            }

            // validate request using identityService
            var identityValidationResponse = identityService.ValidateAllToken(
                accessToken,
                idToken,
                apiClaim,
                clientClaim,
                ServiceId,
                organizationId);

            if (identityValidationResponse.IsError)
            {
                identityValidationResponse.Errors[0].Message = $"User is not Authorized to access {apiClaim}";
                context.Result = new UnauthorizedObjectResult(identityValidationResponse);
            }
            else
            {
                switch (identityValidationResponse.Message)
                {
                    case "101":
                    case "102":
                    case "103":
                    case "104":
                        identityValidationResponse.Errors[0].Message = $"User is not Authorized to access {apiClaim}";
                        context.Result = new UnauthorizedObjectResult(identityValidationResponse);
                        break;
                    default:
                        httpContextAccessor.HttpContext?.Session.SetString("client",
                            identityValidationResponse.Payload.ClientId);
                        httpContextAccessor.HttpContext?.Session.SetString("user",
                            identityValidationResponse.Payload.UserId);
                        httpContextAccessor.HttpContext?.Session.SetString("accessToken", accessToken);
                        break;
                }
            }
        }
        else
        {
            context.Result = new UnauthorizedObjectResult(new { message = "context is  empty." });
        }
    }

    private readonly List<string> _anonymous =
    [
        // "IdentityActions-ApiClaimSeeder",
        // "Notification-GetNotifications",
        // "Notification-Detail",
        // "Notification-GetUnreadCount",
        // "SubTaskAssignment-FillAllForm"
    ];
}