using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.OffloadBaggages;

namespace FSC.Domain.Models.OffloadBaggages;

public class OffloadBaggage : BaseEntity
{
    public long FlightScheduleId { get; set; }
    [ForeignKey(nameof(FlightScheduleId))] public FlightSchedule FlightSchedule { get; set; }

    public string AgentName { get; set; } = string.Empty;
    public string? OffloadingReason { get; set; } = string.Empty;
    public OffloadItemCategory Category { get; set; }
    
    public string? TagNumber { get; set; } = string.Empty;
    public string? PaxTicketNumber { get; set; }
    
    public string? AirWayBillNumber { get; set; } = string.Empty;
    public string? CargoStatus { get; set; }
    
    public string Location { get; set; } = string.Empty;
    public string AkeNumber { get; set; } = string.Empty;
    public string PalateNumber { get; set; } = string.Empty;
    
    public string? Remark { get; set; }
    
    [NotMapped] public List<Attachment> Attachments { get; set; } = [];

    public long RecordedByOfficerId { get; set; }
    [ForeignKey(nameof(RecordedByOfficerId))]
    public Employee RecordedByOfficer { get; set; }

    public static OffloadBaggage Create(
        long flightScheduleId,
        
        string agentName,
        string? offloadingReason,
        OffloadItemCategory category,
        
        string? tagNumber,
        string? paxTicketNumber,
        string? airWayBillNumber,
        string? cargoStatus,
        
        string location,
        string akeNumber,
        string palateNumber,
        
        string? remark,
        
        long recordedByOfficerId
    )
    {
        var offloadBaggage = new OffloadBaggage()
        {
            FlightScheduleId = flightScheduleId,
            
            AgentName = agentName,
            OffloadingReason = offloadingReason,
            Category = category,
            
            TagNumber = tagNumber,
            PaxTicketNumber = paxTicketNumber,
            AirWayBillNumber = airWayBillNumber,
            CargoStatus = cargoStatus,
            
            Location = location,
            AkeNumber = akeNumber,
            PalateNumber = palateNumber,
            
            Remark = remark,
            
            RecordedByOfficerId = recordedByOfficerId,
        };

        var validator = new OffloadBaggageValidator();
        var response = validator.Validate(offloadBaggage);

        if (response.IsValid)
        {
            offloadBaggage.Register();
            offloadBaggage.UpdateAudit();
            return offloadBaggage;
        }

        var exception = new NotValidException();
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }

    public void Update(
        string agentName,
        string? offloadingReason,
        OffloadItemCategory category,
    
        string? tagNumber,
        string? paxTicketNumber,
        string? airWayBillNumber,
        string? cargoStatus,
    
        string location,
        string akeNumber,
        string palateNumber,
    
        string? remark
    )
    {
        AgentName = agentName;
        OffloadingReason = offloadingReason;
        Category = category;
    
        TagNumber = tagNumber;
        PaxTicketNumber = paxTicketNumber;
        AirWayBillNumber = airWayBillNumber;
        CargoStatus = cargoStatus;
    
        Location = location;
        AkeNumber = akeNumber;
        PalateNumber = palateNumber;
    
        Remark = remark;
        
        var validator = new OffloadBaggageValidator();
        var response = validator.Validate(this);

        if (response.IsValid)
        {
            UpdateAudit();
            return;
        }

        var exception = new NotValidException();
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }

}