using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Master.Employees
{
    public record GetAllEmployee(RecordStatus? RecordStatus, string? Position) : IRequest<OperationResult<List<Employee>>>;
    internal class GetAllEmployeeHandler(IRepositoryBase<Employee> employeeRepo)
        : IRequestHandler<GetAllEmployee, OperationResult<List<Employee>>>
    {
        public async Task<OperationResult<List<Employee>>> Handle(GetAllEmployee req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<List<Employee>>();

            // Query employees, filter by RecordStatus and Position name if provided
            var employees = await employeeRepo.Where(x =>
                                        x.RecordStatus != RecordStatus.Deleted &&
                                        (req.RecordStatus == null || req.RecordStatus == x.RecordStatus) &&
                                        (string.IsNullOrEmpty(req.Position) || x.Position.Name.ToLower().Contains( req.Position.ToLower()))
                                    )
                                    .Include(p => p.Position)
                                    .ToListAsync(cancellationToken);

            result.Payload = employees;
            result.Message = "Operation success";
            return result;
        }
    }
}


