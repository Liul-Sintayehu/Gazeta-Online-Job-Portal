namespace FSC.API.Filters;

public class ExceptionHandler : ExceptionFilterAttribute
{
    private readonly ILogger<ExceptionHandler> _logger;
    public ExceptionHandler(ILogger<ExceptionHandler> logger)
    {
        _logger = logger;
    }
    public override void OnException(ExceptionContext context)
    {
        _logger.LogCritical($"exception->{context.Exception} {context.Exception.StackTrace}");
        var apiError = new ErrorResponse
        {
            StatusCode = 500,
            StatusPhrase = "Internal Server Error",
            Timestamp = DateTime.Now,
        };

        apiError.Errors.Add(context.Exception.Message);
        context.Result = new JsonResult(apiError) { StatusCode = 500 };
        _logger.LogError($"exception->{context.Exception.Message} {context.Exception.StackTrace}");

    }
}
