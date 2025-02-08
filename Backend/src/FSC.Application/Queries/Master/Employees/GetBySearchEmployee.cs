using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Master.Employees
{
    public record GetBySearchEmployee(string? employeeId, string? firstName, string? middleName, string? lastName, string? firstSupId, long? positionId) : IRequest<OperationResult<List<Employee>>>;
    internal class GetBySearchEmployeeHandler : IRequestHandler<GetBySearchEmployee, OperationResult<List<Employee>>>
    {
        private readonly IRepositoryBase<Employee> _employee;
        public GetBySearchEmployeeHandler(IRepositoryBase<Employee> _employee) => this._employee = _employee;
        public async Task<OperationResult<List<Employee>>> Handle(GetBySearchEmployee req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<List<Employee>>();
            var employees = from r in _employee.Query() select r;
            if (!string.IsNullOrEmpty(req.employeeId))
                employees = employees.Where(_ => _.EmployeeId.Contains(req.employeeId));
            if (!string.IsNullOrEmpty(req.firstName))
                employees = employees.Where(_ => _.FirstName.Contains(req.firstName));
            if (!string.IsNullOrEmpty(req.middleName))
                employees = employees.Where(_ => _.MiddleName.Contains(req.middleName));
            if (!string.IsNullOrEmpty(req.lastName))
                employees = employees.Where(_ => _.LastName.Contains(req.lastName));
            if (!string.IsNullOrEmpty(req.firstSupId))
                employees = employees.Where(_ => _.FirstSupId.Contains(req.firstSupId));
            if (req.positionId is not null)
                employees = employees.Where(_ => _.PositionId == req.positionId);

            result.Payload = await employees.Where(_ => _.RecordStatus != RecordStatus.Deleted).Include(_ => _.Position).ToListAsync();
            result.Message = "Operation success";
            return result;
        }
    }

}


