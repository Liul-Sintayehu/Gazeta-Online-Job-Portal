namespace FSC.AlertEscalationService.Models.Common;

public enum RecordStatus
{
    InActive = 1,
    Active = 2,
    Deleted = 3
}
public enum WorkingShift
{
    Day = 1,
    Night,
    Grave
}
public enum WorkTaskStatus
{
    Pending = 1,
    ToDo,
    InProgress,
    Completed,
    OnHold
}
public enum NotificationCategory
{
    Assignment = 1,
    Reassignment,
    Approval,
    Rejection,
    WeaponAlert
}
public enum NotificationNature
{
    InApp = 1,
    InEmail
}
public enum NotificationType
{
    Information = 1,
    Success,
    Warning,
    Error
}
