using FSC.Domain.Models.Master;
using FSC.Domain.Validator.Assignment;
using System.ComponentModel.DataAnnotations.Schema;

namespace FSC.Domain.Models.Assignment;

public class FlightClearanceAssignment : BaseEntity
{
    public Guid GuidId { get; set; }
    public long SubTaskId { get; set; }
    [ForeignKey("SubTaskId")]
    public virtual SubTask SubTask { get; set; }
    public WorkTaskStatus TaskStatus { get; set; }
    public string Remark { get; set; }
    public long MajorFlightTaskAssignmentId { get; set; }
    [ForeignKey(nameof(MajorFlightTaskAssignmentId))]
    public virtual MajorFlightTaskAssignment MajorFlightTaskAssignment { get; set; }
 
        
    [ForeignKey("AssignedToEmployee")] 
    public long AssignedTo { get; set; } //Responsible man to this task
    public virtual Employee AssignedToEmployee { get; set; }
    [ForeignKey("AssignedByEmployee")] public long AssignedBy { get; set; }
    public virtual Employee AssignedByEmployee { get; set; }
        
    public static FlightClearanceAssignment Create(long subTaskId, WorkTaskStatus taskStatus, string remark,
        long majorFlightTaskAssignmentId,long assignedTo, long assignedBy)
    {
        var flightClearanceAssignment = new FlightClearanceAssignment
        {
            SubTaskId = subTaskId, TaskStatus = taskStatus, Remark = remark,
            MajorFlightTaskAssignmentId = majorFlightTaskAssignmentId,
            AssignedTo = assignedTo,
            AssignedBy = assignedBy
        };

        var validator = new FlightClearanceAssignmentValidator();
        var response = validator.Validate(flightClearanceAssignment);
        if (response.IsValid) return flightClearanceAssignment;
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void UpdateAssignment(long assignedTo)
    {
        AssignedTo = assignedTo;

        var validator = new FlightClearanceAssignmentValidator();
        var response = validator.Validate(this);
            
        if (response.IsValid) return;
            
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
        
    public void FillClearanceForm(WorkTaskStatus status, string? remark)
    {
        this.TaskStatus = status;
        this.Remark = remark ?? "";

        var validator = new FlightClearanceAssignmentValidator();
        var response = validator.Validate(this);
        if (response.IsValid)   
        {
            return;
        }
        
        var exception = new NotValidException("Validation Error!");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }
}