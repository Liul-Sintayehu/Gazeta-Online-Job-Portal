using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Assignment;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.Approvals;

namespace FSC.Domain.Models.Approvals;

public class Approval: BaseEntity
{
    public long ClearanceAssignmentId { get; set; }
    [ForeignKey(nameof(ClearanceAssignmentId))]
    public ClearanceAssignment ClearanceAssignment { get; set; } = null!;
    
    public long EmployeeId { get; set; }
    [ForeignKey(nameof(EmployeeId))]
    public Employee Employee { get; set; } = null!;

    public ApprovalAction Action { get; set; }
    public string? Remark { get; set; }

    public static Approval Create(long clearanceAssignmentId, long employeeId, ApprovalAction action,
        string? remark)
    {
        var approvalLog = new Approval
        {
            ClearanceAssignmentId = clearanceAssignmentId,
            EmployeeId = employeeId,
            Action = action,
            Remark = remark ?? ""
        };

        approvalLog.Register();

        var validator = new ApprovalValidator();
        var response = validator.Validate(approvalLog);
        if (response.IsValid) return approvalLog; 

        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void Update(long clearanceAssignmentId, long employeeId, ApprovalAction action, string remark)
    {
        ClearanceAssignmentId = clearanceAssignmentId;
        EmployeeId = employeeId;
        Action = action;
        Remark = remark;
        UpdateAudit();
        
        var validator = new ApprovalValidator();
        var response = validator.Validate(this);
        
        if (response.IsValid) return;
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void UpdateStatus(ApprovalAction action, string remark)
    {
        Action = action;
        Remark = remark;
        UpdateAudit();

        var validator = new ApprovalValidator();
        var response = validator.Validate(this);
        if (response.IsValid) return; //valid
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
}