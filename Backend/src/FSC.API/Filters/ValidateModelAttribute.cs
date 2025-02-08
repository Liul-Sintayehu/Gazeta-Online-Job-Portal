namespace FSC.API.Filters;
public class ValidateModelAttribute : ActionFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext context)
    {
        if (context.ModelState.IsValid) return;
        
        var apiError = new ErrorResponse
        {
            StatusCode = 400,
            StatusPhrase = "Bad Request",
            Timestamp = DateTime.Now
        };
        var errors = context.ModelState.AsEnumerable();

        foreach (var error in errors)
        {
            foreach (var inner in error.Value.Errors)
            {
                apiError.Errors.Add(inner.ErrorMessage);
            }
        }

        context.Result = new BadRequestObjectResult(apiError);
    }
}
