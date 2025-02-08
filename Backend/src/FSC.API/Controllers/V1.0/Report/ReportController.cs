using FSC.API.Controllers.Common;
using FSC.Application.Queries.Report;
namespace FSC.API.Controllers.V1._0.Report;

public class ReportController(IMediator mediator) : BaseController
{
    [HttpGet("GeneratePdf/{clearanceAssignmentId:long}")]
    public async Task<IActionResult> GeneratePdf(long clearanceAssignmentId)
    {
        // Resolve the full path to the image file in the wwwroot folder
        var backgroundSealImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Files", "NISS-SEAL-no-background.png");

        var result = await mediator.Send(new GeneratePdfReportCommand(backgroundSealImagePath, clearanceAssignmentId));
        var response = result.Payload;
        return result.IsError ? HandleErrorResponse(result.Errors)
            : File(response, "application/pdf", $"CheckList-Report-{DateTime.Now.ToLongTimeString()}.pdf");
    }
}
