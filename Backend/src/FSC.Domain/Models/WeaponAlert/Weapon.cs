using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.WeaponAlert;

namespace FSC.Domain.Models.WeaponAlert;

public class Weapon : BaseEntity
{
    public string TagNumber { get; set; } = string.Empty;
    public string PalateNumber { get; set; } = string.Empty;
    public string AKENumber { get; set; } = string.Empty;
    public string? Remark { get; set; } = string.Empty;
    public string? AttachmentFilePath { get; set; } = string.Empty;

    // Transit Passengers
    public bool IsTransit { get; set; }

    public string? TransitPassengerName { get; set; } = string.Empty;

    // public string? PassportNumber { get; set; } = string.Empty;
    public string? TicketNumber { get; set; } = string.Empty;
    public string? Contact { get; set; } = string.Empty;

    [NotMapped] public List<Attachment> Attachments { get; set; } = [];
    public bool? IsAlertSent { get; set; }

    // Relation
    public long? FlightScheduleId { get; init; }
    [ForeignKey(nameof(FlightScheduleId))] public FlightSchedule? FlightSchedule { get; init; }

    public static Weapon Create(string tagNumber,
        string palateNumber,
        string akeNumber,
        string? remark,
        long flightScheduleId,
        bool isTransit,
        string? transitPassengerName,
        string? ticketNumber,
        string? contact,
        string? attachmentFilePath
    )
    {
        var weapon = new Weapon()
        {
            TagNumber = tagNumber,
            PalateNumber = palateNumber,
            AKENumber = akeNumber,
            Remark = remark,
            FlightScheduleId = flightScheduleId,
            AttachmentFilePath = attachmentFilePath,
            IsAlertSent = false,
            IsTransit = isTransit,
            TransitPassengerName = isTransit ? transitPassengerName : null,
            TicketNumber = isTransit ? ticketNumber : null,
            Contact = isTransit ? contact : null
        };

        var validator = new WeaponValidator();
        var response = validator.Validate(weapon);

        if (response.IsValid)
        {
            weapon.Register();
            weapon.UpdateAudit();
            return weapon;
        }

        var exception = new NotValidException("Validation Error");
        response.Errors.ForEach(vf => exception.ValidationErrors.Add(vf.ErrorMessage));
        throw exception;
    }

    public void Update(string tagNumber,
        string palateNumber,
        string akeNumber,
        string? remark,
        bool isTransit,
        string? transitPassengerName,
        string? ticketNumber,
        string? contact,
        string? attachmentFilePath
    )
    {
        TagNumber = tagNumber;
        PalateNumber = palateNumber;
        AKENumber = akeNumber;
        Remark = remark;
        AttachmentFilePath = attachmentFilePath;
        IsTransit = isTransit;

        if (isTransit)
        {
            TransitPassengerName = transitPassengerName;
            TicketNumber = ticketNumber;
            Contact = contact;
        }
        else
        {
            TransitPassengerName = null;
            TicketNumber = null;
            Contact = null;
        }

        IsAlertSent = false;

        var validator = new WeaponValidator();
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