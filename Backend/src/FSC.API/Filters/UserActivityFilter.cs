using Newtonsoft.Json;

namespace FSC.API.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class UserActivityFilter : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            try
            {
                var url = $"{context.RouteData.Values["controller"]}/{context.RouteData.Values["action"]}";
                if (!string.IsNullOrEmpty(context.HttpContext.Request.QueryString.Value))
                {
                }

                if (context.ActionArguments.Any())
                {
                    var payloadData = context.ActionArguments.FirstOrDefault();
                    var payloadDataString = JsonConvert.SerializeObject(payloadData);
                }
                //var username = context.HttpContext.User.Identity.Name == null ? string.Empty : context.HttpContext.User.Identity.Name;
                var username = context.HttpContext.Session.GetString("user");
                var ipAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString();
                var executedContext = await next();
                var response = executedContext.Result;
                var statusCode = response?.GetType()?.GetProperty("StatusCode")?.GetValue(response, null)?.ToString();
                //LogAction(context, username, ipAddress, url, payload, statusCode);
            }
            catch (Exception ex)
            {
                await next();
                return;
            }
        }

        public async Task<bool> LogAction(ActionExecutingContext context, string userName, string ipAddress, string url, string payload, string statusCode)
        {
            var mediator = context.HttpContext.RequestServices.GetService<IMediator>();
            await mediator!.Send(new EventLogCreate { UserName = userName, IpAddress = ipAddress, URL = url, Payload = payload, StatusCode = statusCode });
            return true;
        }
    }
}
