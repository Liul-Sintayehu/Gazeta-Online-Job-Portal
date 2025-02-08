using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Helpers;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.LostAndFound;

namespace FSC.Domain.Models.LostAndFound;

public class LostAndFoundItem : BaseEntity
{
    public string ReferenceNumber { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FoundLocation { get; set; } = string.Empty;
    public DateTime DateTimeFound { get; set; }
    public int Amount { get; set; }
    public string? Price { get; set; }

    public string? Shift { get; set; }
    public string? AgentId { get; set; }
    public string? AgentName { get; set; }
    public string? ReceiptNumber { get; set; }

    public string? FlightNumber { get; set; }
    public DateTime? FlightDate { get; set; }
    public string? AircraftType { get; set; }
    public bool? IsReturned { get; set; }

    public string? SecurityOfficerName { get; set; }
    public string? SecurityOfficerId { get; set; }
    
    public string? ConfirmationSignature { get; set; }
    public DateTime? SignedOn { get; set; }
    
    [NotMapped] public List<Attachment> Attachments { get; set; } = [];
    
    public long RecordedByOfficerId { get; set; }

    [ForeignKey(nameof(RecordedByOfficerId))]
    public Employee RecordedByOfficer { get; set; }

    public static LostAndFoundItem Create(
        string referenceNumber,
        string itemName,
        string category,
        string foundLocation,
        DateTime dateTimeFound,
        int amount,
        string? price,
        string? shift,
        string? agentId,
        string? agentName,
        string? receiptNumber,
        string? flightNumber,
        DateTime? flightDate,
        string? aircraftType,
        bool? isReturned,
        
        string? securityOfficerName,
        string? securityOfficerId,
        
        long recordedByOfficerId)
    {
        var lostAndFoundItem = new LostAndFoundItem
        {
            ReferenceNumber = referenceNumber,
            
            ItemName = itemName,
            Category = category,
            FoundLocation = foundLocation,
            DateTimeFound = dateTimeFound,
            Amount = amount,
            Price = price,
            
            Shift = shift,
            AgentId = agentId,
            AgentName = agentName,
            ReceiptNumber = receiptNumber,
            
            FlightNumber = flightNumber,
            FlightDate = flightDate,
            AircraftType = aircraftType,
            IsReturned = isReturned,
            
            SecurityOfficerName = securityOfficerName,
            SecurityOfficerId = securityOfficerId,
            
            RecordedByOfficerId = recordedByOfficerId
        };

        var validator = new LostAndFoundItemValidator();
        var response = validator.Validate(lostAndFoundItem);

        if (response.IsValid)
        {
            lostAndFoundItem.Register();
            lostAndFoundItem.UpdateAudit();
            return lostAndFoundItem;
        }

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }

    public void Update(
        string itemName,
        string category,
        string foundLocation,
        DateTime dateTimeFound,
        int amount,
        string? price,
        
        string? shift,
        string? agentId,
        string? agentName,
        string? receiptNumber,
        
        string? flightNumber,
        DateTime? flightDate,
        string? aircraftType,
        bool? isReturned,
        
        string? securityOfficerName,
        string? securityOfficerId
    )
    {
        ItemName = itemName;
        Category = category;
        FoundLocation = foundLocation;
        DateTimeFound = dateTimeFound;
        Amount = amount;
        Price = price;
        
        Shift = shift;
        AgentId = agentId;
        AgentName = agentName;
        ReceiptNumber = receiptNumber;
        
        FlightNumber = flightNumber;
        FlightDate = flightDate;
        AircraftType = aircraftType;

        SecurityOfficerName = securityOfficerName;
        SecurityOfficerId = securityOfficerId;
        
        IsReturned = isReturned;

        ConfirmationSignature = string.Empty;
        SignedOn = null;
        
        var validator = new LostAndFoundItemValidator();
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

    public void SignAgent(string signatureImagePath)
    {
        ConfirmationSignature = signatureImagePath;
        SignedOn = Helper.GetDateTimeNow();
        UpdateAudit("Signing agent");
    }

    public void RemoveAgentSignature()
    {
        ConfirmationSignature = null;
        SignedOn = null;
        UpdateAudit("Removing agent signature");
    }
}