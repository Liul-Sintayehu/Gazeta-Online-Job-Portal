using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Master.Employees
{
    public record GetByIdEmployee(long Id) : IRequest<OperationResult<Employee>>;
    internal class GetByIdEmployeeHandler : IRequestHandler<GetByIdEmployee, OperationResult<Employee>>
    {
        private readonly IRepositoryBase<Employee> _employee;
        public GetByIdEmployeeHandler(IRepositoryBase<Employee> _employee) => this._employee = _employee;
        public async Task<OperationResult<Employee>> Handle(GetByIdEmployee req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<Employee>();
            var employee = _employee.Where(x => x.Id == req.Id && x.RecordStatus != RecordStatus.Deleted).Include(_ => _.Position).FirstOrDefault();
            if (employee == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }
            result.Payload = employee;
            result.Message = "Operation success";
            return result;
        }
    }

}
