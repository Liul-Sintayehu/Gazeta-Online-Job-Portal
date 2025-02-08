using FSC.Domain.Models.Master;
using FSC.Domain.Validator.Assignment;
using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Helpers;
using FSC.Domain.Models.Approvals;

namespace FSC.Domain.Models.Assignment
{
    public class MajorFlightTaskAssignment : BaseEntity
    {
        public long FlightScheduleId { get; set; }
        public virtual FlightSchedule FlightSchedule { get; set; }
        public long MajorTaskId { get; set; }
        public virtual MajorTask MajorTask { get; set; }

        // SecurityTeamLeader
        public long? SecurityTeamLeaderId { get; set; }
        [ForeignKey(nameof(SecurityTeamLeaderId))]
        public virtual Employee? SecurityTeamLeader { get; set; }

        // ResponsiblePilot
        public long? ResponsiblePilotId { get; set; }
        [ForeignKey(nameof(ResponsiblePilotId))]
        public virtual Employee? ResponsiblePilot { get; set; }

        // TeamLeaderApproval
        public long? TeamLeaderApprovalId { get; set; }
        [ForeignKey(nameof(TeamLeaderApprovalId))]
        public virtual ApprovalLog? TeamLeaderApproval { get; set; }

        #region Must be in different object =>Clearance handling
        // PilotApproval
        public long? PilotApprovalId { get; set; }
        [ForeignKey(nameof(PilotApprovalId))]
        public virtual ApprovalLog? PilotApproval { get; set; }

        // Approval Request from Officer
        public bool IsPushedForApproval { get; set; }
        public DateTime? PushForApprovalOn { get; set; }
        public long? PushOfficerId { get; set; }
        public virtual Employee? PushOfficer { get; set; }
        #endregion


        public ICollection<ApprovalLog> ApprovalLogs { get; set; }

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
            if (SecurityTeamLeaderId is null)
            {
                throw new InvalidOperationException("Team Leader has not assigned yet!");
            }

            if (!IsPushedForApproval)
                throw new InvalidOperationException(
                    "Task must be pushed for approval before it can be approved by the team leader.");

            switch (TeamLeaderApproval)
            {
                case { Action: ApprovalAction.Approved }:
                    throw new InvalidOperationException("Task has already been approved by the team leader.");
                case null:
                    TeamLeaderApproval = ApprovalLog.Create(
                        Id,
                        SecurityTeamLeaderId ?? 0,
                        null,
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
                PilotApproval = ApprovalLog.Create(
                    Id,
                    ResponsiblePilotId ?? 0,
                    null,
                    ApprovalAction.Pending,
                    ""
                );

            // If rejected revert the pushed for approval
            if (action == ApprovalAction.Rejected)
            {
                IsPushedForApproval = false;
            }
        }

        // Method for pilot approval
        public void UpdatePilotApproval(ApprovalAction action, string remark)
        {
            if (!IsPushedForApproval)
                throw new InvalidOperationException(
                    "Task must be pushed for approval before it can be approved by the pilot.");
            if (TeamLeaderApproval is null)
            {
                throw new InvalidOperationException(
                    "Team Leader approval is not performed yet!");

            }

            if (TeamLeaderApproval is null)
            {
                throw new InvalidOperationException(
                    "Team Leader approval is not performed yet!");

            }
            if (TeamLeaderApproval?.Action != ApprovalAction.Approved)
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

            if (action == ApprovalAction.Rejected)
            {
                TeamLeaderApproval.Action = ApprovalAction.Pending;
            }
        }

        public static MajorFlightTaskAssignment Create(long flightScheduleId, long securityTeamLeaderId,
            long responsiblePilotId, long majorTaskId)
        {
            var majorFlightTaskAssignment = new MajorFlightTaskAssignment
            {
                FlightScheduleId = flightScheduleId,
                SecurityTeamLeaderId = securityTeamLeaderId,
                ResponsiblePilotId = responsiblePilotId,
                MajorTaskId = majorTaskId
            };

            var validator = new MajorFlightTaskAssignmentValidator();
            var response = validator.Validate(majorFlightTaskAssignment);
            if (response.IsValid) return majorFlightTaskAssignment;

            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }

        public void Update(long flightScheduleId, long securityTeamLeaderId, long responsiblePilotId, long majorTaskId)
        {
            FlightScheduleId = flightScheduleId;
            SecurityTeamLeaderId = securityTeamLeaderId;
            ResponsiblePilotId = responsiblePilotId;
            MajorTaskId = majorTaskId;

            var validator = new MajorFlightTaskAssignmentValidator();
            var response = validator.Validate(this);
            if (response.IsValid) return;

            var exception = new NotValidException("Model is not valid");
            response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
            throw exception;
        }
    }
}