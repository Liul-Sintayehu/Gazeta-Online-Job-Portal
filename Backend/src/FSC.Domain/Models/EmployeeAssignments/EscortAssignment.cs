using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Master;

namespace FSC.Domain.Models.EmployeeAssignments;

public class EscortAssignment : BaseEntity
{
    public long EscortId { get; set; }
    [ForeignKey(nameof(EscortId))] 
    public Escort Escort { get; set; } = null!;
    public long EmployeeId { get; set; }
    [ForeignKey(nameof(EmployeeId))]
    public Employee Employee { get; set; } = null!;
    
    public AssignmentStatus Status { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string? Remark { get; set; }

    public static EscortAssignment Create(long escortId, long employeeId)
    {
        var assignment = new EscortAssignment
        {
            EmployeeId = employeeId,
            EscortId = escortId,
            Status = AssignmentStatus.Active
        };
        assignment.Register();
        return assignment;
    }

    public void Update(AssignmentStatus status, DateTime? startTime, DateTime? endTime, string? remark)
    {
        Status = status;
        StartTime = startTime;
        EndTime = endTime;
        Remark = remark;
        
        UpdateAudit();
    }
}