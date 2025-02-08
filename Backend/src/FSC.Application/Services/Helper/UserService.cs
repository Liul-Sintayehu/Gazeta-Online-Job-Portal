using FSC.Domain.Models.Master;
using Microsoft.AspNetCore.Http;

namespace FSC.Application.Services.Helper;

public class UserService(IHttpContextAccessor httpContextAccessor, IRepositoryBase<Employee> employeeRepo)
{
    public async Task<Employee> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        var userId = 
            httpContextAccessor.HttpContext?.Session.GetString("user")?.TrimStart('0');

        if (string.IsNullOrEmpty(userId))
        {
            throw new UnregisteredUserException("User ID is missing or invalid.");
        }

        var employees = await employeeRepo
            .Where(emp => true).Select(employee => 
                new { employee.EmployeeId, employee.Id }) 
            .ToListAsync(cancellationToken);

        var matchedEmployee = employees
            .FirstOrDefault(e => e.EmployeeId.TrimStart('0') == userId);

        if (matchedEmployee == null)
        {
            throw new UnregisteredUserException($"User with ID '{userId}' does not exist.");
        }

        // Retrieve the full employee record based on the matched ID
        var user = await employeeRepo
            .Where(emp => emp.Id == matchedEmployee.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (user == null)
        {
            throw new UnregisteredUserException($"User with ID '{userId}' does not exist.");
        }

        return user;
    }
}


public class UnregisteredUserException(string message) : Exception(message);
