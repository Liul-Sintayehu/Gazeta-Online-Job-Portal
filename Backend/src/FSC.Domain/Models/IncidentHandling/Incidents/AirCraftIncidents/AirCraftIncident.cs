using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Validator.IncidentHandling;
using Severity = FSC.Domain.Common.Severity;

namespace FSC.Domain.Models.IncidentHandling.Incidents.AirCraftIncidents;

public class AirCraftIncident : Incident
{
    public string FlightParkingPosition { get; set; } = string.Empty;
    public string DepartureCountry { get; set; } = string.Empty;
    public string ArrivalCountry { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty;
    public string FlightRegistration { get; set; } = string.Empty;
    public string DamageDirection { get; set; } = string.Empty;
    public string DamagedPart { get; set; } = string.Empty;
    public string AircraftCondition { get; set; } = string.Empty;
    public DateTime? MaintenanceStartDate { get; set; }
    public DateTime? MaintenanceEndDate { get; set; }

    [NotMapped] public List<Attachment> Attachments { get; set; } = [];

    
    public static AirCraftIncident Create(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        
        string flightParkingPosition,
        string departureCountry,
        string arrivalCountry,
        string flightNumber,
        string flightRegistration,
        string damageDirection,
        string damagedPart,
        string aircraftCondition,
        
        DateTime? maintenanceStartDate,
        DateTime? maintenanceEndDate,
        
        long recordedByOfficerId
    )
    {
        var aircraftIncident = new AirCraftIncident()
        {
            IncidentCategory = IncidentCategory.AirCraftIncident,
            IncidentStatus = IncidentStatus.AwaitingAction,

            IncidentDate = incidentDate,
            Description = description,
            Location = location,
            Severity = severity,

            FlightParkingPosition = flightParkingPosition,
            DepartureCountry = departureCountry,
            ArrivalCountry = arrivalCountry,
            FlightNumber = flightNumber,
            FlightRegistration = flightRegistration,
            DamageDirection = damageDirection,
            DamagedPart = damagedPart,
            AircraftCondition = aircraftCondition,
            
            MaintenanceStartDate = maintenanceStartDate,
            MaintenanceEndDate = maintenanceEndDate,

            RecordedByOfficerId = recordedByOfficerId
        };

        var validator = new AirCraftIncidentValidator();
        var response = validator.Validate(aircraftIncident);

        if (response.IsValid)
        {
            aircraftIncident.Register();
            return aircraftIncident;
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
        
        string flightParkingPosition,
        string departureCountry,
        string arrivalCountry,
        string flightNumber,
        string flightRegistration,
        string damageDirection,
        string damagedPart,
        string aircraftCondition,
        DateTime? maintenanceStartDate,
        DateTime? maintenanceEndDate,
        
        IncidentStatus incidentStatus,
        string? resolution,
        string? remark
    )
    {
        IncidentDate = incidentDate;
        Description = description;
        Location = location;
        Severity = severity;

        FlightParkingPosition = flightParkingPosition;
        DepartureCountry = departureCountry;
        ArrivalCountry = arrivalCountry;
        FlightNumber = flightNumber;
        FlightRegistration = flightRegistration;
        DamageDirection = damageDirection;
        DamagedPart = damagedPart;
        AircraftCondition = aircraftCondition;

        MaintenanceStartDate = maintenanceStartDate;
        MaintenanceEndDate = maintenanceEndDate;

        if (incidentStatus != IncidentStatus) UpdateIncidentStatus(incidentStatus, resolution, remark);

        var validator = new AirCraftIncidentValidator();
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