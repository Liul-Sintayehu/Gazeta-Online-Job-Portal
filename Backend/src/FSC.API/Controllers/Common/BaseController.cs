using System.Reflection;

namespace FSC.API.Controllers.Common;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class BaseController : ControllerBase
{
    private IMediator _mediatorInstance;
    private IMapper _mapperInstance;
    private IStringLocalizer<SharedLocalizationResource> _stringLocalizerInstrance;

    protected IStringLocalizer<SharedLocalizationResource> _stringLocalizer => _stringLocalizerInstrance ??=
        HttpContext.RequestServices.GetService<IStringLocalizer<SharedLocalizationResource>>();

    protected IMediator _mediator => _mediatorInstance ??= HttpContext.RequestServices.GetService<IMediator>();
    protected IMapper _mapper => _mapperInstance ??= HttpContext.RequestServices.GetService<IMapper>();

    protected IActionResult HandleErrorResponse(List<Error> errors)
    {
        var apiError = new ErrorResponse();

        if (errors.Any(e => e.Code == ErrorCode.NotFound))
        {
            var error = errors.FirstOrDefault(e => e.Code == ErrorCode.NotFound);

            apiError.StatusCode = 404;
            apiError.StatusPhrase = "Not Found";
            apiError.Timestamp = DateTime.Now;
            apiError.Errors.Add(error.Message);

            return NotFound(apiError);
        }

        if (errors.Any(e => e.Code == ErrorCode.UnAuthorized))
        {
            var error = errors.First(e => e.Code == ErrorCode.UnAuthorized);

            apiError.StatusCode = (int)ErrorCode.UnAuthorized;
            apiError.StatusPhrase = _stringLocalizer["UnAuthorized"] ?? "UnAuthorized";
            apiError.Timestamp = DateTime.Now;
            apiError.Errors.Add(_stringLocalizer[error.Message] ?? error.Message);

            return StatusCode((int)ErrorCode.UnAuthorized, apiError);
        }

        apiError.StatusCode = 400;
        apiError.StatusPhrase = _stringLocalizer["Bad request"] ?? "Bad request";
        apiError.Timestamp = DateTime.Now;
        errors.ForEach(e => apiError.Errors.Add(_stringLocalizer[e.Message] ?? e.Message));
        return StatusCode(400, apiError);
    }

    protected IActionResult HandleTokenErrorResponse(List<Error> errors)
    {
        var clientStatus = string.Empty;
        var apiError = new OperationResult<UserTokenValidationResponse>();

        if (errors.Any(e => e.Code == ErrorCode.ServerError))
        {
            var error = errors.FirstOrDefault(e => e.Code == ErrorCode.ServerError);

            apiError.Message = "Server error";
            apiError.AddError(ErrorCode.ServerError, "Server error");
            return StatusCode(500, apiError);
        }

        clientStatus = errors.Any(x => x.Message == "User is not Authorized to access.") ? "104" : clientStatus;
        clientStatus = errors.Any(x => x.Message == "Id token is invalid.") ? "103" : clientStatus;
        clientStatus = errors.Any(x => x.Message == "Client is not Authorized.") ? "102" : clientStatus;
        clientStatus = errors.Any(x => x.Message == "Client token is invalid.") ? "101" : clientStatus;
        apiError.Message = clientStatus;
        errors.ForEach(e => apiError.AddError(ErrorCode.ServerError, e.Message));
        return StatusCode(401, apiError);
    }
}

public static class ControllerHelper
{
    public static List<string> CollectControllerMethodNames()
    {
        var result = new List<string>();
        //var asm = Assembly.GetExecutingAssembly();
        var asm = Assembly.GetExecutingAssembly();
        var controllers = asm.GetTypes().Where(type => typeof(ControllerBase).IsAssignableFrom(type)).SelectMany(type =>
                type.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public))
            .Where(m => !m.GetCustomAttributes(typeof(System.Runtime.CompilerServices.CompilerGeneratedAttribute), true)
                .Any())
            .Select(x => new
            {
                Controller = x.DeclaringType.Name,
                Action = x.Name,
                ReturnType = x.ReturnType.Name,
                Attributes = String.Join(",",
                    x.GetCustomAttributes().Select(a => a.GetType().Name.Replace("Attribute", "")))
            }).OrderBy(x => x.Controller)
            .ThenBy(x => x.Action)
            .ToList();
        controllers.ForEach(x => result.Add($"{x.Controller.Replace("Controller", "")}-{x.Action}"));
        return result;
    }
}