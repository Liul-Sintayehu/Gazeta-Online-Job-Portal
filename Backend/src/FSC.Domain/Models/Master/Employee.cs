using FSC.Domain.Validator.Master;
using System.ComponentModel.DataAnnotations;

namespace FSC.Domain.Models.Master;

public class Employee : BaseEntity
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    [EmailAddress] public string Email { get; set; } = string.Empty;
    public WorkingShift Shift { get; set; }
    public string FirstSupId { get; set; } = string.Empty;
    public long? PositionId { get; set; }
    public virtual Position Position { get; set; } = null!;

    public static Employee Create(
        string employeeId,
        string firstName,
        string middleName,
        string lastName,
        string email,
        WorkingShift shift,
        string firstSupId,
        long? positionId,
        string createdBy = "")
    {
        ArgumentNullException.ThrowIfNull(employeeId);

        var employee = new Employee
        {
            EmployeeId = employeeId,
            FirstName = firstName,
            MiddleName = middleName,
            LastName = lastName,
            Email = email,
            Shift = shift,
            FirstSupId = firstSupId,
            PositionId = positionId
        };

        var validator = new EmployeeValidator();
        var response = validator.Validate(employee);
        if (response.IsValid)
        {
            employee.Register(createdBy);
            return employee;
        }

        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void Update(
        string employeeId, 
        string firstName, 
        string middleName, 
        string lastName, 
        string email,
        WorkingShift shift, 
        string firstSupId, 
        long? positionId,
        string updatedBy = "")
    {
        EmployeeId = employeeId;
        FirstName = firstName;
        MiddleName = middleName;
        LastName = lastName;
        Email = email;
        Shift = shift;
        FirstSupId = firstSupId;
        PositionId = positionId;

        var validator = new EmployeeValidator();
        var response = validator.Validate(this);
        if (response.IsValid)
        {
            UpdateAudit(updatedBy);
            return;
        }
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
}