using FSC.API.Contracts.Common;
using FSC.API.Controllers.Common;
using FSC.Application.Commands.Master.Employees;
using FSC.Application.Models.Dots.Master.Employees;
using FSC.Application.Models.Dtos.Master.Employees;
using FSC.Application.Queries.Master.Employees;

namespace FSC.API.Controllers.V1._0.Master;

public class EmployeeController : BaseController
{
    #region Query
    [HttpGet]
    public async Task<IActionResult> GetAll(RecordStatus? recordStatus, string? position)
    {
        var result = await _mediator.Send(new GetAllEmployee(recordStatus, position));
        var response = _mapper.Map<List<EmployeeDetailDto>>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(long id)
    {
        var result = await _mediator.Send(new GetByIdEmployee(id));
        var response = _mapper.Map<EmployeeDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    [HttpGet("Search")]
    public async Task<IActionResult> Search(string? employeeId, string? firstName, string? middleName, string? lastName, string? firstSupId, long? positionId)
    {
        var result = await _mediator.Send(new GetBySearchEmployee(employeeId, firstName, middleName, lastName, firstSupId, positionId));
        var response = _mapper.Map<List<EmployeeDetailDto>>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    #endregion
    #region Commands
    [HttpPost("Create")]
    [ValidateModel]
    public async Task<IActionResult> Create([FromBody] EmployeeDto request)
    {
        var result = await _mediator.Send(new CreateEmployee(request.EmployeeId, request.FirstName, request.MiddleName, request.LastName, request.Email, request.Shift, request.FirstSupId, request.PositionId));
        var response = _mapper.Map<EmployeeDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    [HttpPut("Update/{id}")]
    [ValidateModel]
    public async Task<IActionResult> Update([FromBody] EmployeeDto request, long id)
    {
        var result = await _mediator.Send(new UpdateEmployee(id, request.EmployeeId, request.FirstName, request.MiddleName, request.LastName, request.Email, request.Shift, request.FirstSupId, request.PositionId));
        var response = _mapper.Map<EmployeeDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    [HttpPut("UpdateStatus/{id}")]
    [ValidateModel]
    public async Task<IActionResult> Update([FromBody] RecordStatusDto request, long id)
    {
        var result = await _mediator.Send(new UpdateStatusEmployee(id, request.Status));
        var response = _mapper.Map<EmployeeDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var result = await _mediator.Send(new DeleteEmployee(id));
        var response = _mapper.Map<EmployeeDetailDto>(result.Payload);
        return result.IsError ? HandleErrorResponse(result.Errors) : Ok(response);
    }
    #endregion
    
    #region Import/Export
    [HttpPost("ImportBulkEmployee")]
    [ValidateModel]
    public async Task<IActionResult> ImportBulkEmployee(IFormFile excelFile)
    {
        var result = await _mediator.Send(new ImportBulkEmployee(excelFile));
        
        if (result.IsError)
        {
            return HandleErrorResponse(result.Errors);
        }

        var response = _mapper.Map<List<EmployeeDetailDto>>(result.Payload);
        return Ok(response);
    }
    [HttpGet("DownloadExcelTemplate")]
    public async Task<IActionResult> DownloadExcelTemplate()
    {
        var fileContents = await _mediator.Send(new DownloadExcelTemplateEmployee());
        return File(fileContents.Payload, "application/octet-stream", "Employee_Upload_template_" + DateTime.UtcNow.Ticks + ".xlsx");
    }
    #endregion
}