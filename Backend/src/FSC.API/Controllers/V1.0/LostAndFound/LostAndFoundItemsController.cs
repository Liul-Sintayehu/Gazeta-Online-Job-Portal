using System.Globalization;
using FSC.Api.Contracts.Common;
using FSC.API.Controllers.Common;
using FSC.Application.Commands.LostAndFound;
using FSC.Application.Commands.LostAndFound.Signature;
using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Application.Models.Dtos.LostAndFound.Response;
using FSC.Application.Queries.LostAndFound;

namespace FSC.API.Controllers.V1._0.LostAndFound;

public class LostAndFoundItemsController : BaseController
{
    #region Query
        
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] GetLostAndFoundItemsQueryDto request)
    {
        var result = await _mediator.Send(new GetAllLostAndFoundItem(request));
        if (result.IsError)
        {
            return HandleErrorResponse(result.Errors);
        }
            
        var lostAndFoundItems = _mapper.Map<List<LostAndFoundItemDetailDto>>(result.Payload);
        var totalCount = await _mediator.Send(new GetLostAndFoundItemsTotalCountByQuery(request));
        var response = new LostAndFoundItemsPaginatedResponseDto()
        {
            LostAndFoundItems = lostAndFoundItems,
            TotalCount = totalCount.Payload
        };
            
        return Ok(response);
    }
        
        
    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        var result = await _mediator.Send(new GetByIdLostAndFoundItem(id));
        var response = _mapper.Map<LostAndFoundItemDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
        
    [HttpGet("Export")]
    public async Task<IActionResult> Export([FromQuery] GetLostAndFoundItemsQueryDto request)
    {
        var result = await _mediator.Send(new ExportLostAndFoundByQuery(request));
        return result.IsError
            ? HandleErrorResponse(result.Errors)
            : File(result.Payload, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"Lost and Found Items List - {DateTime.Now.ToString(CultureInfo.InvariantCulture)}.xlsx");
    }
        
    [HttpGet("Search")]
    public async Task<IActionResult> Search(string? itemName, string? referenceNumber)
    {
        var result = await _mediator.Send(new GetBySearchLostAndFoundItem(itemName, referenceNumber));
        var response = _mapper.Map<List<LostAndFoundItemDetailDto>>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
        
        
    #endregion

    #region Command
        
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] LostAndFoundItemDto request)
    {
        var result = await _mediator.Send(new CreateLostAndFoundItem(request));
        if (result.IsError) return HandleErrorResponse(result.Errors);

        var response = _mapper.Map<LostAndFoundItemDetailDto>(result.Payload);
        return Ok(response);
    }
        
    [HttpPost("SignAgent/{id:long}")]
    public async Task<IActionResult> SignAgent([FromRoute] long id, [FromForm] AddAgentSignatureRequestDto request)
    {
        var result = await _mediator.Send(new AddAgentSignature(id, request));
        return result.IsError ?  HandleErrorResponse(result.Errors): Ok(result.Payload);
    }
        
    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Create([FromBody] LostAndFoundItemDto request, long id)
    {
        var result = await _mediator.Send(new UpdateLostAndFoundItem(id, request));
        if (result.IsError) return HandleErrorResponse(result.Errors);

        var response = _mapper.Map<LostAndFoundItemDetailDto>(result.Payload);
        return Ok(response);
    }
        
    [HttpPut("UpdateStatus/{id}")]
    public async Task<IActionResult> UpdateStatus([FromBody] StatusRequest request, long id)
    {
        var result = await _mediator.Send(new UpdateStatusLostAndFoundItem(id, request.Status));
        var response = _mapper.Map<LostAndFoundItemDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
        
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var result = await _mediator.Send(new DeleteLostAndFoundItem(id));
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok();
    }
        
    [HttpDelete("RemoveAgentSign/{id:long}")]
    public async Task<IActionResult> RemoveAgentSign([FromRoute] long id)
    {
        var result = await _mediator.Send(new RemoveAgentSignature(id));
        return result.IsError ?  HandleErrorResponse(result.Errors): Ok(result.Payload);
    }

    #endregion
}