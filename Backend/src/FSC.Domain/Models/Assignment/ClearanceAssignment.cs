using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Helpers;
using FSC.Domain.Models.Approvals;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.Assignment;

namespace FSC.Domain.Models.Assignment;

public class ClearanceAssignment : BaseEntity
{
    public long FlightScheduleId { get; set; }
    public virtual FlightSchedule FlightSchedule { get; set; } = null!;

    // SecurityTeamLeader
    public long SecurityTeamLeaderId { get; set; }

    [ForeignKey(nameof(SecurityTeamLeaderId))]
    public virtual Employee? SecurityTeamLeader { get; set; }

    // ResponsiblePilot
    public long? ResponsiblePilotId { get; set; }

    [ForeignKey(nameof(ResponsiblePilotId))]
    public virtual Employee? ResponsiblePilot { get; set; }

    // TeamLeaderApproval
    public long? TeamLeaderApprovalId { get; set; }

    [ForeignKey(nameof(TeamLeaderApprovalId))]
    public virtual Approval? TeamLeaderApproval { get; set; }

    // PilotApproval
    public long? PilotApprovalId { get; set; }
    [ForeignKey(nameof(PilotApprovalId))] 
    public virtual Approval? PilotApproval { get; set; }
    
    // Approval Request from Officer
    public bool IsPushedForApproval { get; set; }
    public DateTime? PushForApprovalOn { get; set; }
    public long? PushOfficerId { get; set; }

    public virtual Employee? PushOfficer { get; set; }
    
    // Method for pushing the task for approval
    public void PushForApproval(long pushOfficerId)
    {
        if (IsPushedForApproval) throw new InvalidOperationException("Task has already been pushed for approval.");

        IsPushedForApproval = true;
        PushForApprovalOn = Helper.GetDateTimeNow();
        PushOfficerId = pushOfficerId;
    }

    // Method for team leader approval
    public void UpdateTeamLeaderApproval(ApprovalAction action, string remark)
    {
        if (!IsPushedForApproval)
            throw new InvalidOperationException(
                "Task must be pushed for approval before it can be approved by the team leader.");

        switch (TeamLeaderApproval)
        {
            case { Action: ApprovalAction.Approved }:
                throw new InvalidOperationException("Task has already been approved by the team leader.");
            case null:
                TeamLeaderApproval = Approval.Create(
                    Id,
                    SecurityTeamLeaderId,
                    action,
                    remark
                );
                break;
            default:
                TeamLeaderApproval.Action = action;
                TeamLeaderApproval.Remark = remark;
                TeamLeaderApproval.UpdateAudit();
                break;
        }

        if (ResponsiblePilotId is not null)
            PilotApproval = Approval.Create(
                Id,
                ResponsiblePilotId ?? 0,
                ApprovalAction.Pending,
                ""
            );

        // If rejected revert the pushed for approval
        if (action == ApprovalAction.Rejected) IsPushedForApproval = false;
    }

    // Method for pilot approval
    public void UpdatePilotApproval(ApprovalAction action, string remark)
    {
        if (!IsPushedForApproval)
            throw new InvalidOperationException(
                "Task must be pushed for approval before it can be approved by the pilot.");
        if (TeamLeaderApproval is null)
            throw new InvalidOperationException(
                "Team Leader approval is not performed yet!");
        if (TeamLeaderApproval is null)
            throw new InvalidOperationException(
                "Team Leader approval is not performed yet!");
        if (TeamLeaderApproval.Action != ApprovalAction.Approved)
            throw new InvalidOperationException(
                "Task must be approved by the team leader before it can be approved by the pilot.");

        switch (PilotApproval)
        {
            case null:
                throw new InvalidOperationException("Pilot has no approval log yet!");
            case { Action: ApprovalAction.Approved }:
                throw new InvalidOperationException("Task has already been approved by the pilot.");
        }

        PilotApproval.Action = action;
        PilotApproval.Remark = remark;
        PilotApproval.UpdateAudit();

        if (action == ApprovalAction.Rejected) TeamLeaderApproval.Action = ApprovalAction.Pending;
    }

    public void Update(long flightScheduleId, long securityTeamLeaderId, long responsiblePilotId)
    {
        FlightScheduleId = flightScheduleId;
        SecurityTeamLeaderId = securityTeamLeaderId;
        ResponsiblePilotId = responsiblePilotId;

        var validator = new ClearanceAssignmentValidator();
        var response = validator.Validate(this);
        if (response.IsValid) return;

        var exception = new NotValidException("Model is not valid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
}