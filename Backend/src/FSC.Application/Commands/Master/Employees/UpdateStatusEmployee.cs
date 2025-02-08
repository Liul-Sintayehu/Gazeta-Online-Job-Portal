using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.Employees
{
    public record UpdateStatusEmployee(long Id, RecordStatus RecordStatus) : IRequest<OperationResult<Employee>>;
    internal class UpdateStatusEmployeeHandler(IRepositoryBase<Employee> employeeRepo)
        : IRequestHandler<UpdateStatusEmployee, OperationResult<Employee>>
    {
        public async Task<OperationResult<Employee>> Handle(UpdateStatusEmployee req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<Employee>();
            var employee = await employeeRepo.FirstOrDefaultAsync(x => x.Id == req.Id);
            if (employee is null)
            {
                result.AddError(ErrorCode.NotFound, "No record found,");
                return result;
            }
            employee.UpdateRecordStatus(req.RecordStatus);
            await employeeRepo.UpdateAsync(employee);
            result.Payload = employee;
            result.Message = "Operation success";
            return result;
        }
    }
}


