using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Helpers;
using FSC.Domain.Models.Master;

namespace FSC.Domain.Models.WeaponAlert;

public class WeaponHandling : BaseEntity
{
    public string? Remark { get; set; }
    public bool IsSent { get; set; }
    
    public bool? IsReadyToResend { get; set; } = null;
    public DateTime AlertSentOn { get; set; }
    public DateTime? AlertResentOn { get; set; }
    

    // Responsible Officer Assignment
    public long? AssignedById { get; set; }
    [ForeignKey(nameof(AssignedById))] public Employee? AssignedBy { get; set; }
    
    public long? ResponsibleOfficerId { get; set; }

    [ForeignKey(nameof(ResponsibleOfficerId))]
    public Employee? ResponsibleOfficer { get; set; }

    public DateTime AssignedOn { get; set; }
    public DateTime AssignUpdateOn { get; set; }

    public WorkTaskStatus HandleStatus { get; set; }
    public DateTime HandleStatusLastUpdate { get; set; }
    public DateTime CompletedOn { get; set; }

    public int EscalationCount { get; set; }
    public DateTime ReminderSentOn { get; set; }
    public DateTime FirstEscalationSentOn { get; set; }
    public DateTime SecondEscalationSentOn { get; set; }

    // Relation
    public long FlightScheduleId { get; init; }
    [ForeignKey(nameof(FlightScheduleId))] public FlightSchedule FlightSchedule { get; init; } = null!;

    public static WeaponHandling CreateAlertHandling(
        long flightScheduleId, string? remark)
    {
        var weaponHandling = new WeaponHandling()
        {
            Remark = remark,
            FlightScheduleId = flightScheduleId,
            IsSent = true,
            AlertSentOn = Helper.GetDateTimeNow(),
            EscalationCount = 1,
            IsReadyToResend = false
        };

        weaponHandling.Register();

        return weaponHandling;
    }

    public void UpdateAlertHandling(string? remark)
    {
        Remark = remark;
        IsReadyToResend = false;
        AlertResentOn = Helper.GetDateTimeNow();
        UpdateAudit();
    }

    public void AssignOfficer(long officerId, long assignedById)
    {
        if (ResponsibleOfficerId == null)
            AssignedOn = Helper.GetDateTimeNow();

        AssignUpdateOn = Helper.GetDateTimeNow();
        AssignedById = assignedById;
        ResponsibleOfficerId = officerId;
        HandleStatus = WorkTaskStatus.Pending;
        UpdateAudit();
    }

    public void UpdateHandleStatus(WorkTaskStatus status)
    {
        HandleStatus = status;
        HandleStatusLastUpdate = Helper.GetDateTimeNow();

        if (status == WorkTaskStatus.Completed) CompletedOn = Helper.GetDateTimeNow();
    }
}