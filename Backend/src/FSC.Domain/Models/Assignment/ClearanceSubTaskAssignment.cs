using FSC.Domain.Models.Master;
using System.ComponentModel.DataAnnotations.Schema;

namespace FSC.Domain.Models.Assignment;

public class ClearanceSubTaskAssignment : BaseEntity
{
    public long SubTaskId { get; set; }
    [ForeignKey(nameof(SubTaskId))]
    public virtual SubTask SubTask { get; set; } = null!;
    
    public long ClearanceAssignmentId { get; set; }
    [ForeignKey(nameof(ClearanceAssignmentId))]
    public virtual ClearanceAssignment ClearanceAssignment { get; set; } = null!;    
    
    public WorkTaskStatus TaskStatus { get; set; }
    public string? Remark { get; set; }
    
    public long AssignedToId { get; set; } 
    [ForeignKey(nameof(AssignedToId))]
    public virtual Employee AssignedTo { get; set; } = null!;

    public static ClearanceSubTaskAssignment Create(
        long subTaskId,
        WorkTaskStatus taskStatus,
        string remark,
        long clearanceAssignmentId,
        long assignedTo,
        string updatedBy = "")
    {
        var flightClearanceAssignment = new ClearanceSubTaskAssignment
        {
            SubTaskId = subTaskId, TaskStatus = taskStatus, Remark = remark,
            ClearanceAssignmentId = clearanceAssignmentId,
            AssignedToId = assignedTo,
        };
        
        flightClearanceAssignment.Register(updatedBy);
        return flightClearanceAssignment;
    }

    public void UpdateAssignment(long assignedTo, string updatedBy  = "")
    {
        TaskStatus = WorkTaskStatus.Pending;
        Remark = null;
        AssignedToId = assignedTo;
        UpdateAudit(updatedBy);
    }

    public void FillClearanceForm(WorkTaskStatus status, string? remark, string updatedBy = "")
    {
        TaskStatus = status;
        Remark = remark ?? "";
        UpdateAudit(updatedBy);
    }
}