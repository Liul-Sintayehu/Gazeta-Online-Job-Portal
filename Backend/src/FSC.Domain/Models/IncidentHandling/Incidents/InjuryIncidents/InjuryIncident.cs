using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Validator.IncidentHandling;
using Severity = FSC.Domain.Common.Severity;

namespace FSC.Domain.Models.IncidentHandling.Incidents.InjuryIncidents;

public class InjuryIncident : Incident
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string InjuredBodyPart { get; set; } = string.Empty;
    public string InjuryDescription { get; set; } = string.Empty;
    public string InjuryCause { get; set; } = string.Empty;
    public string SpecificLocation { get; set; } = string.Empty;
    public DateTime SpecificTime { get; set; }
    public bool IsReported { get; set; }

    [NotMapped] public List<Attachment> Attachments { get; set; } = [];

    public static InjuryIncident Create(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        string injuredPersonFullName,
        string injuredPersonPhoneNumber,
        string department,
        string injuredBodyPart,
        string injuryDescription,
        string injuryCause,
        string specificLocation,
        DateTime specificTime,
        bool isReported,
        long recordedByOfficerId
    )
    {
        var injuryIncident = new InjuryIncident
        {
            IncidentCategory = IncidentCategory.InjuryIncident,
            IncidentStatus = IncidentStatus.AwaitingAction,

            IncidentDate = incidentDate,
            Description = description,
            Location = location,
            Severity = severity,

            Name = injuredPersonFullName,
            PhoneNumber = injuredPersonPhoneNumber,
            Department = department,
            InjuredBodyPart = injuredBodyPart,
            InjuryDescription = injuryDescription,
            InjuryCause = injuryCause,
            SpecificLocation = specificLocation,
            SpecificTime = specificTime,
            IsReported = isReported,

            RecordedByOfficerId = recordedByOfficerId
        };

        var validator = new InjuryIncidentValidator();
        var response = validator.Validate(injuryIncident);

        if (response.IsValid)
        {
            injuryIncident.Register();
            return injuryIncident;
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
        string injuredPersonFullName,
        string injuredPersonPhoneNumber,
        string department,
        string injuredBodyPart,
        string injuryDescription,
        string injuryCause,
        string specificLocation,
        DateTime specificTime,
        bool isReported,
        IncidentStatus incidentStatus,
        string? resolution,
        string? remark
    )
    {
        IncidentDate = incidentDate;
        Description = description;
        Location = location;
        Severity = severity;

        Name = injuredPersonFullName;
        PhoneNumber = injuredPersonPhoneNumber;
        Department = department;
        InjuredBodyPart = injuredBodyPart;
        InjuryDescription = injuryDescription;
        InjuryCause = injuryCause;
        SpecificLocation = specificLocation;
        SpecificTime = specificTime;
        IsReported = isReported;

        if (incidentStatus != IncidentStatus) UpdateIncidentStatus(incidentStatus, resolution, remark);

        var validator = new InjuryIncidentValidator();
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