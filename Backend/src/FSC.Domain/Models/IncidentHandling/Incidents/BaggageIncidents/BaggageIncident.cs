using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Validator.IncidentHandling;
using Severity = FSC.Domain.Common.Severity;

namespace FSC.Domain.Models.IncidentHandling.Incidents.BaggageIncidents;

public class BaggageIncident : Incident
{
    public BaggageIncidentType BaggageIncidentType { get; set; }
    public string? BaggageOrigin { get; set; }

    public bool IsFoundOnAircraft { get; set; }
    public DateTime? FlightArrivalTime { get; set; }
    public string? FlightBoardingCountry { get; set; }
    public string? FlightArrivalCountry { get; set; } 
    public string? FlightArrivalAirport { get; set; }
    public string? FlightNumber { get; set; }
    public string? AircraftTail { get; set; }
    public bool? HasTag { get; set; }
    public int NumberOfBags { get; set; }

    public string? BagsSerialized { get; set; } 
   
    [NotMapped]
    public List<BagIdentifier>? Bags
    {
        get => string.IsNullOrEmpty(BagsSerialized)
            ? []
            : JsonSerializer.Deserialize<List<BagIdentifier>>(BagsSerialized);

        private set => BagsSerialized = JsonSerializer.Serialize(value);
    }

    public string? PassengerName { get; set; }
    public string? PassengerPhoneNo { get; set; }
    public string? PassengerEmail { get; set; }
    
    [NotMapped]
    public List<Attachment> Attachments { get; set; } = [];
    
    public static BaggageIncident Create(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        
        BaggageIncidentType baggageIncidentType,
        string? baggageOrigin,
        bool isFoundOnAircraft,
        DateTime? flightArrivalTime,
        string? flightBoardingCountry,
        string? flightArrivalCountry,
        string? flightArrivalAirport,
        string? aircraftTail,
        string? flightNumber,
        
        bool? hasTag,
        int numberOfBags,
        List<BagIdentifier>? bags,
        
        string? passengerName,
        string? passengerPhoneNo,
        string? passengerEmail,
        
        long recordedByOfficerId
    )
    {
        var newBaggageIncident = new BaggageIncident
        {
            IncidentCategory = IncidentCategory.BaggageIncident,
            IncidentStatus = IncidentStatus.AwaitingAction,
            
            Description = description,
            Location = location,
            Severity = severity,
            
            BaggageIncidentType = baggageIncidentType,
            IncidentDate = incidentDate,
            BaggageOrigin = baggageOrigin,
            HasTag = hasTag,
            NumberOfBags = numberOfBags,
            Bags = bags, 
            
            IsFoundOnAircraft = isFoundOnAircraft,
            FlightArrivalTime = flightArrivalTime,
            FlightBoardingCountry = flightBoardingCountry,
            FlightArrivalCountry = flightArrivalCountry,
            FlightArrivalAirport = flightArrivalAirport,
            AircraftTail = aircraftTail,
            FlightNumber = flightNumber,
            
            PassengerName = passengerName,
            PassengerPhoneNo = passengerPhoneNo,
            PassengerEmail = passengerEmail,
            
            RecordedByOfficerId = recordedByOfficerId,
        };

        var validator = new BaggageIncidentValidation();
        var response = validator.Validate(newBaggageIncident);

        if (response.IsValid)
        {
            newBaggageIncident.Register();
            newBaggageIncident.UpdateAudit();
            return newBaggageIncident;
        }

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }
    
    public void Update(
        DateTime incidentDate,
        string? description,
        string? location,
        Severity severity,
        
        BaggageIncidentType baggageIncidentType,
        string? baggageOrigin,
        bool? hasTag,
        int numberOfBags,
        List<BagIdentifier>? bags,
                
        bool isFoundOnAircraft,
        DateTime? flightArrivalTime,
        string? flightBoardingCountry,
        string? flightArrivalCountry,
        string? flightArrivalAirport,
        string? aircraftTail,
        string? flightNumber,
        
        string? passengerName,
        string? passengerPhoneNo,
        string? passengerEmail,
        
        IncidentStatus incidentStatus,
        string? resolution,
        string? remark
    )
    {
        Severity = severity;
        IncidentDate = incidentDate;
        Description = description;
        Location = location;
        
        BaggageIncidentType = baggageIncidentType;
        BaggageOrigin = baggageOrigin;
        HasTag = hasTag;
        NumberOfBags = numberOfBags;
        Bags = bags;  
        
        IsFoundOnAircraft = isFoundOnAircraft;
        FlightArrivalTime = flightArrivalTime;
        FlightBoardingCountry = flightBoardingCountry;
        FlightArrivalCountry = flightArrivalCountry;
        FlightArrivalAirport = flightArrivalAirport;
        AircraftTail = aircraftTail;
        FlightNumber = flightNumber;
        
        PassengerName = passengerName;
        PassengerPhoneNo = passengerPhoneNo;
        PassengerEmail = passengerEmail;

        if (incidentStatus != IncidentStatus)
        {
            UpdateIncidentStatus(incidentStatus, resolution, remark);
        }

        var validator = new BaggageIncidentValidation();
        var response = validator.Validate(this);

        if (response.IsValid)
        {
            UpdateAudit();
            return;
        }

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }
}