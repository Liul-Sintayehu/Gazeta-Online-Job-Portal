using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Validator.IncidentHandling;
using Severity = FSC.Domain.Common.Severity;

namespace FSC.Domain.Models.IncidentHandling.Incidents.TheftIncidents;

public class TheftIncident : Incident
{
    public string SpecificLocation { get; set; } = string.Empty;
    public string TheftExplanation { get; set; } = string.Empty;
    public bool DiscoveredDuringInspection { get; set; }
    public bool CaughtInTheAct { get; set; }
    public bool OnDuty { get; set; }

    public StolenItemCategory StolenItemCategory { get; set; }
    public string? TagNumber { get; set; }
    public string? AirWaybillNumber { get; set; }
    public string? LabelNumber { get; set; }

    public string? ExhibitsSerialized { get; set; }

    public bool IsSuspectIdentified { get; set; }
    public string? SuspectName { get; set; }
    public string? SuspectDepartment { get; set; }
    public string? SuspectSupervisorName { get; set; }

    [NotMapped]
    public List<ExhibitItem>? Exhibits
    {
        get => string.IsNullOrEmpty(ExhibitsSerialized)
            ? []
            : JsonSerializer.Deserialize<List<ExhibitItem>>(ExhibitsSerialized);

        private set => ExhibitsSerialized = JsonSerializer.Serialize(value);
    }

    [NotMapped] public List<Attachment> Attachments { get; set; } = [];

    public static TheftIncident Create(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        string specificLocation,
        string theftExplanation,
        bool discoveredDuringInspection,
        bool caughtInTheAct,
        bool onDuty,
        StolenItemCategory stolenItemCategory,
        string? tagNumber,
        string? airWaybillNumber,
        string? labelNumber,
        bool isSuspectIdentified,
        string? suspectName,
        string? suspectDepartment,
        string? suspectSupervisorName,
        List<ExhibitItem>? exhibits,
        long recordedByOfficerId
    )
    {
        var theftIncident = new TheftIncident()
        {
            IncidentCategory = IncidentCategory.TheftIncident,
            IncidentStatus = IncidentStatus.AwaitingAction,

            IncidentDate = incidentDate,
            Description = description,
            Location = location,
            Severity = severity,

            SpecificLocation = specificLocation,
            TheftExplanation = theftExplanation,
            DiscoveredDuringInspection = discoveredDuringInspection,
            CaughtInTheAct = caughtInTheAct,
            OnDuty = onDuty,

            StolenItemCategory = stolenItemCategory,
            TagNumber = tagNumber,
            AirWaybillNumber = airWaybillNumber,
            LabelNumber = labelNumber,
            Exhibits = exhibits,
            
            IsSuspectIdentified = isSuspectIdentified,
            SuspectName = suspectName,
            SuspectDepartment = suspectDepartment,
            SuspectSupervisorName = suspectSupervisorName,

            RecordedByOfficerId = recordedByOfficerId
        };

        var validator = new TheftIncidentValidator();
        var response = validator.Validate(theftIncident);

        if (response.IsValid)
        {
            theftIncident.Register();
            return theftIncident;
        }

        var errors = new NotValidException();
        response.Errors.ForEach(failure => errors.ValidationErrors.Add(failure.ErrorMessage));
        throw errors;
    }

    public void Update(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        string specificLocation,
        string theftExplanation,
        bool discoveredDuringInspection,
        bool caughtInTheAct,
        bool onDuty,
        StolenItemCategory stolenItemCategory,
        string? tagNumber,
        string? airWaybillNumber,
        string? labelNumber,
        List<ExhibitItem>? exhibits,
        bool isSuspectIdentified,
        string? suspectName,
        string? suspectDepartment,
        string? suspectSupervisorName,
        IncidentStatus incidentStatus,
        string? resolution,
        string? remark
    )
    {
        IncidentDate = incidentDate;
        Description = description;
        Location = location;
        Severity = severity;

        SpecificLocation = specificLocation;
        TheftExplanation = theftExplanation;
        DiscoveredDuringInspection = discoveredDuringInspection;
        CaughtInTheAct = caughtInTheAct;
        OnDuty = onDuty;

        StolenItemCategory = stolenItemCategory;
        TagNumber = tagNumber;
        AirWaybillNumber = airWaybillNumber;
        LabelNumber = labelNumber;
        Exhibits = exhibits;

        IsSuspectIdentified = isSuspectIdentified;
        SuspectName = suspectName;
        SuspectDepartment = suspectDepartment;
        SuspectSupervisorName = suspectSupervisorName;
        
        if (incidentStatus != IncidentStatus) UpdateIncidentStatus(incidentStatus, resolution, remark);

        var validator = new TheftIncidentValidator();
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
}