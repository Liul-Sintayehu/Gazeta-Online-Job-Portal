using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Helpers;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Models.IncidentHandling.Incidents;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.IncidentHandling;

namespace FSC.Domain.Models.IncidentHandling.Investigations;

public class Investigation : BaseEntity
{
    public long IncidentId { get; set; }
    public virtual Incident Incident { get; set; } = null!;

    // Investigation details
    public string? InvestigationMethod { get; set; }
    public string? MainIssue { get; set; }
    public string? Findings { get; set; }
    public string? RootCause { get; set; }
    public string? Recommendations { get; set; }
    public string? CorrectiveActions { get; set; }

    // Legal and compliance
    public bool IsLegalInvolved { get; set; }
    public string? LegalFindings { get; set; }
    public string? RegulatoryViolations { get; set; }

    // Investigation Outcome
    public string? Outcome { get; set; }
    public string? FinalResolution { get; set; }

    // Workflow state and tracking
    public WorkTaskStatus Status { get; set; }
    
    [NotMapped]
    public List<Attachment> Attachments { get; set; } = [];

    // Investigator and Team Leader 
    public long? InvestigatorId { get; set; }
    [ForeignKey("InvestigatorId")] public virtual Employee? Investigator { get; set; }
    public string? InvestigatorSignaturePath { get; set; }
    public DateTime? InvestigatorSignedOn { get; set; }
    public string? InvestigatorComment { get; set; }

    public long? TeamLeaderId { get; set; }
    [ForeignKey("TeamLeaderId")] public virtual Employee? TeamLeader { get; set; }
    public string? TeamLeaderSignaturePath { get; set; }
    public DateTime? TeamLeaderSignedOn { get; set; }
    public string? TeamLeaderComment { get; set; }

    // Navigation properties for related witnesses and suspects
    public virtual ICollection<Witness> Witnesses { get; set; } = new List<Witness>();
    public virtual ICollection<Suspect> Suspects { get; set; } = new List<Suspect>();

    public static Investigation Create(
        long incidentId,
        string investigationMethod,
        long investigatorId,
        string mainIssue,
        string? findings,
        string? rootCause,
        string? recommendations,
        string? correctiveActions,
        bool isLegalInvolved,
        string? legalFindings,
        string? regulatoryViolations,
        string? outcome,
        string? finalResolution)
    {
        var investigation = new Investigation()
        {
            IncidentId = incidentId,


            InvestigatorId = investigatorId,

            InvestigationMethod = investigationMethod,
            MainIssue = mainIssue,
            Findings = findings,
            RootCause = rootCause,
            Recommendations = recommendations,
            CorrectiveActions = correctiveActions,

            IsLegalInvolved = isLegalInvolved,
            LegalFindings = legalFindings,
            RegulatoryViolations = regulatoryViolations,

            Outcome = outcome,
            FinalResolution = finalResolution,

            Status = WorkTaskStatus.InProgress
        };

        var validator = new InvestigationValidator();
        var response = validator.Validate(investigation);
        if (response.IsValid)
        {
            investigation.Register();
            return investigation;
        }

        var errors = new NotValidException();
        response.Errors.ForEach(failure => errors.ValidationErrors.Add(failure.ErrorMessage));
        throw errors;
    }

    public void Update(
        List<Suspect> suspects,
        List<Witness> witnesses,
        string investigationMethod,
        string mainIssue,
        string? findings,
        string? rootCause,
        string? recommendations,
        string? correctiveActions,
        bool isLegalInvolved,
        string? legalFindings,
        string? regulatoryViolations,
        string? outcome,
        string? finalResolution,
        WorkTaskStatus status)
    {
        Suspects = suspects;
        Witnesses = witnesses;

        InvestigationMethod = investigationMethod;
        MainIssue = mainIssue;
        Findings = findings;
        RootCause = rootCause;
        Recommendations = recommendations;
        CorrectiveActions = correctiveActions;

        IsLegalInvolved = isLegalInvolved;
        LegalFindings = legalFindings;
        RegulatoryViolations = regulatoryViolations;

        Outcome = outcome;
        FinalResolution = finalResolution;

        if (status != Status)
        {
            UpdateStatus(status);
        }

        var validator = new InvestigationValidator();
        var response = validator.Validate(this);
        if (response.IsValid)
        {
            UpdateAudit();
            return;
        }

        var errors = new NotValidException();
        response.Errors.ForEach(failure => errors.ValidationErrors.Add(failure.ErrorMessage));
        throw errors;
    }

    public void SelectTeamLeader(long teamLeaderId)
    {
        TeamLeaderId = teamLeaderId;
        TeamLeaderComment = null;
        TeamLeaderSignaturePath = null;
        TeamLeaderSignedOn = null;
    }
    public void SignInvestigator(string signatureImagePath)
    {
        InvestigatorSignaturePath = signatureImagePath;
        InvestigatorSignedOn = Helper.GetDateTimeNow();
        UpdateAudit("Signing investigator");
    }
    
    public void RemoveInvestigatorSign()
    {
        InvestigatorSignaturePath = null;
        InvestigatorSignedOn = null;
        UpdateAudit("Removing  investigator signature");
    }
    
    public void SignTeamLeader(string signatureImagePath)
    {
        TeamLeaderSignaturePath = signatureImagePath;
        TeamLeaderSignedOn = Helper.GetDateTimeNow();
        UpdateAudit("Signing team leader");
    }
    
    public void RemoveTeamLeaderSign()
    {
        TeamLeaderSignaturePath = null;
        TeamLeaderSignedOn = null;
        UpdateAudit("Removing team leader signature");
    }
    
    private void UpdateStatus(WorkTaskStatus status)
    {
        Status = status;
        if (status != WorkTaskStatus.Completed) return;
        EndRecord();
    }
    
}