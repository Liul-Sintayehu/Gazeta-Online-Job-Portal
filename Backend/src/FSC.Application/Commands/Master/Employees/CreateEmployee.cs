using FSC.Application.Services.Helper;
using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.Employees;

public record CreateEmployee(
    string EmployeeId,
    string FirstName,
    string MiddleName,
    string LastName,
    string Email,
    WorkingShift Shift,
    string FirstSupId,
    long? PositionId) : IRequest<OperationResult<Employee>>;

internal class CreateEmployeeHandler(IRepositoryBase<Employee> employeeRepo, UserService userService)
    : IRequestHandler<CreateEmployee, OperationResult<Employee>>
{
    public async Task<OperationResult<Employee>> Handle(CreateEmployee req, CancellationToken cancellationToken)
    {
        var result = new OperationResult<Employee>();

        try
        {
            // Get the authenticated user
            var currentUser = await userService.GetCurrentUserAsync(cancellationToken);
            var userFullName =
                $"{currentUser.FirstName} {currentUser.MiddleName} {currentUser.LastName} ({currentUser.EmployeeId})";

            if (await employeeRepo.ExistWhereAsync(x =>
                    x.EmployeeId == req.EmployeeId && x.RecordStatus != RecordStatus.Deleted))
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Record already exists.");
                return result;
            }

            if (req.PositionId == 0)
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Position can't be zero.");
                return result;
            }


            var employee = Employee.Create
            (
                req.EmployeeId,
                req.FirstName,
                req.MiddleName,
                req.LastName,
                req.Email,
                req.Shift,
                req.FirstSupId,
                req.PositionId,
                userFullName
            );

            await employeeRepo.AddAsync(employee);
            result.Payload = employee;
            result.Message = "Operation success";
        }
        catch (UnregisteredUserException ex)
        {
            result.AddError(ErrorCode.UnAuthorized, ex.Message);
        }
        catch (ArgumentNullException)
        {
            result.AddError(ErrorCode.ValidationError, "There is a null value in the given required field.");
        }
        catch (Exception ex)
        {
            result.AddError(ErrorCode.ServerError, ex.Message);
        }

        return result;
    }
}