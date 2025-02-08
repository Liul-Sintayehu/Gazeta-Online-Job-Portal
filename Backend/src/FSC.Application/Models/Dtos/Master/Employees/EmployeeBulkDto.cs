namespace FSC.Application.Models.Dtos.Master.Employees;

public class EmployeeBulkDto
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Shift { get; set; } = string.Empty;
    public string FirstSupId { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
}