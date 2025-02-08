using FSC.API.Controllers.Common;
using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Queries.Dashboard;

namespace FSC.API.Controllers.V1._0.Report;

public class DashboardController: BaseController
{
    [HttpGet("MasterData")]
    public async Task<IActionResult> GetMasterData()
    {
        var result = await _mediator.Send(new MasterDataDashboardQuery());
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("Clearance")]
    public async Task<IActionResult> GetClearance([FromQuery] ClearanceAssignmentDashboardRequestDto request)
    {
        var result = await _mediator.Send(new ClearanceAssignmentDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("WeaponAlert")]
    public async Task<IActionResult> GetWeaponAlert([FromQuery] WeaponAlertDashboardRequestDto request)
    {
        var result = await _mediator.Send(new WeaponAlertDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("Incident")]
    public async Task<IActionResult> GetIncident([FromQuery] IncidentDashboardRequestDto request)
    {
        var result = await _mediator.Send(new IncidentDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("Investigation")]
    public async Task<IActionResult> GetInvestigation([FromQuery] InvestigationDashboardRequestDto request)
    {
        var result = await _mediator.Send(new InvestigationDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("OffloadBaggage")]
    public async Task<IActionResult> GetOffloadBaggage([FromQuery] OffloadBaggageDashboardRequestDto request)
    {
        var result = await _mediator.Send(new OffloadBaggageDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("Escort")]
    public async Task<IActionResult> GetEscort([FromQuery] EscortDashboardRequestDto request)
    {
        var result = await _mediator.Send(new EscortDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
    
    [HttpGet("LostAndFound")]
    public async Task<IActionResult> GetLostAndFound([FromQuery] LostAndFoundDashboardRequestDto request)
    {
        var result = await _mediator.Send(new LostAndFoundDashboardQuery(request));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(result.Payload);
    }
}