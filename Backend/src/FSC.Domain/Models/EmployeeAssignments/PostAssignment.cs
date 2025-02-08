using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Master;

namespace FSC.Domain.Models.EmployeeAssignments;

public class PostAssignment : BaseEntity
{
    public WorkingShift Shift { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }

    public AssignmentStatus Status { get; set; }
    public string? Remark { get; set; }

    public long PostId { get; set; }
    [ForeignKey(nameof(PostId))]
    public Post Post { get; set; } = null!;
    
    public long EmployeeId { get; set; }
    [ForeignKey(nameof(EmployeeId))]
    public Employee Employee { get; set; } = null!;
    
    public static PostAssignment Create(
        WorkingShift shift,
        DateTime fromDate,
        DateTime toDate,
        long postId,
        long employeeId)
    {
        var assignment = new PostAssignment()
        {
            Shift = shift,
            FromDate = fromDate,
            ToDate = toDate,
            Status = AssignmentStatus.Active,
            PostId = postId,
            EmployeeId = employeeId,
        };
        
        assignment.Register();
        return assignment;
    }
    
    public void Update(
        DateTime fromDate,
        DateTime toDate,
        DateTime? startTime,
        DateTime? endTime,
        AssignmentStatus status,
        string? remark)
    {
        FromDate = fromDate;
        ToDate = toDate;
        StartTime = startTime;
        EndTime = endTime;
        Status = status;
        Remark = remark;
        
        UpdateAudit();
    }
}