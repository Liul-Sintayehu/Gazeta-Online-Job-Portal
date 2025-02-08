using System.ComponentModel.DataAnnotations;
 

namespace FSC.Application.Models.Dtos.Master.Employees;

public class EmployeeDetailDto
{
    public long Id { get; set; }
    public string EmployeeId { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public WorkingShift Shift { get; set; }
    public string ShiftName => Shift.ToString();
    public string FirstSupId { get; set; }
    public long? PositionId { get; set; }
    public PositionDetailDto? Position { get; set; }
    public RecordStatus RecordStatus { get; set; }
}