using FSC.AlertEscalationService.Helpers;

namespace FSC.AlertEscalationService.Models.Common;

public class BaseEntity
{
    public long Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string TimeZoneInfo { get; set; } = string.Empty;
    public DateTime RegisteredDate { get; set; }
    public string RegisteredBy { get; set; } = string.Empty;
    public DateTime LastUpdateDate { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
    public RecordStatus RecordStatus { get; set; }
    public bool IsReadOnly { get; set; }

}