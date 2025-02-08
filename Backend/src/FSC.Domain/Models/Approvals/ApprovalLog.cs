using FSC.Domain.Models.Assignment;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.Approvals;

namespace FSC.Domain.Models.Approvals;

public class ApprovalLog : BaseEntity
{
    public long MajorFlightTaskAssignmentId { get; set; }
    public MajorFlightTaskAssignment MajorFlightTaskAssignment { get; set; }
    public long EmployeeId { get; set; }
    public Employee Employee { get; set; }
    public long? PositionId { get; set; }
    public Position Position { get; set; }
    public ApprovalAction Action { get; set; }
    public string Remark { get; set; }

    public static ApprovalLog Create(long majorFlightTaskAssignmentId, long employeeId, long? positionId, ApprovalAction action,
        string? remark)
    {
        var approvalLog = new ApprovalLog
        {
            MajorFlightTaskAssignmentId = majorFlightTaskAssignmentId,
            EmployeeId = employeeId,
            PositionId = positionId,
            Action = action,
            Remark = remark ?? ""
        };

        approvalLog.Register();

        var validator = new ApprovalLogValidator();
        var response = validator.Validate(approvalLog);
        if (response.IsValid) return approvalLog; 

        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void Update(long majorFlightTaskAssignmentId, long employeeId, long? positionId, ApprovalAction action, string remark)
    {
        MajorFlightTaskAssignmentId = majorFlightTaskAssignmentId;
        EmployeeId = employeeId;
        EmployeeId = employeeId;
        PositionId = positionId;
        Action = action;
        Remark = remark;

        var validator = new ApprovalLogValidator();
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

        var validator = new ApprovalLogValidator();
        var response = validator.Validate(this);
        if (response.IsValid) return; //valid
        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
}