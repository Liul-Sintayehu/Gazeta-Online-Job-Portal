using FSC.Application.Services.Helper;
using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.Employees;

public record DeleteEmployee(long Id) : IRequest<OperationResult<Employee>>;

internal class DeleteEmployeeHandler(IRepositoryBase<Employee> employeeRepo, UserService userService)
    : IRequestHandler<DeleteEmployee, OperationResult<Employee>>
{
    public async Task<OperationResult<Employee>> Handle(DeleteEmployee req, CancellationToken cancellationToken)
    {
        var result = new OperationResult<Employee>();

        try
        {
            // Get the authenticated user
            var currentUser = await userService.GetCurrentUserAsync(cancellationToken);
            var userFullName =
                $"{currentUser.FirstName} {currentUser.MiddleName} {currentUser.LastName} ({currentUser.EmployeeId})";

            var employee = await employeeRepo
                .Where(x => x.Id == req.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (employee == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }

            if (employee.IsReadOnly)
            {
                result.AddError(ErrorCode.ServerError, "Record cannot be deleted.");
                return result;
            }

            employee.Delete(userFullName);

            await employeeRepo.UpdateAsync(employee);

            result.Payload = employee;
            result.Message = "Operation success";
        }
        catch (UnregisteredUserException ex)
        {
            result.AddError(ErrorCode.UnAuthorized, ex.Message);
        }
        catch (Exception e)
        {
            result.AddError(ErrorCode.ServerError, e.Message);
        }

        return result;
    }
}