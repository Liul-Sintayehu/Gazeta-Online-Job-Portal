using FSC.Application.Services.Helper;
using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.Employees;

public record UpdateEmployee(
    long Id,
    string EmployeeId,
    string FirstName,
    string MiddleName,
    string LastName,
    string Email,
    WorkingShift Shift,
    string FirstSupId,
    long? PositionId) : IRequest<OperationResult<Employee>>;

internal class UpdateEmployeeHandler(IRepositoryBase<Employee> employeeRepo, UserService userService)
    : IRequestHandler<UpdateEmployee, OperationResult<Employee>>
{
    public async Task<OperationResult<Employee>> Handle(UpdateEmployee req, CancellationToken cancellationToken)
    {
        var result = new OperationResult<Employee>();

        try
        {
            // Get the authenticated user
            var currentUser = await userService.GetCurrentUserAsync(cancellationToken);
            var userFullName =
                $"{currentUser.FirstName} {currentUser.MiddleName} {currentUser.LastName} ({currentUser.EmployeeId})";

            var employee = await employeeRepo
                .Where(e => e.Id == req.Id && e.RecordStatus != RecordStatus.Deleted)
                .FirstOrDefaultAsync(cancellationToken);

            if (employee is null)
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "No record to update.");
                return result;
            }

            if (await employeeRepo.ExistWhereAsync(x =>
                    x.EmployeeId == req.EmployeeId && x.RecordStatus != RecordStatus.Deleted && x.Id != req.Id))
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Name already exists.");
                return result;
            }

            if (req.PositionId == 0)
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Position can't be zero.");
                return result;
            }

            employee.Update(
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