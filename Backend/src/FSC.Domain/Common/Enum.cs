namespace FSC.Domain.Common;
public enum RecordStatus
{
    InActive = 1,
    Active = 2,
    Deleted = 3
}

public enum FlightCategory
{
    International = 1,
    Domestic,
    Cargo
}

public enum WorkingShift
{
    Day = 1,
    Evening,
    Night
}
public enum WorkTaskStatus
{
    Pending = 1,
    ToDo,
    InProgress,
    Completed,
    OnHold
}
public enum Priority
{
    Critical = 1,
    High,
    Normal,
    Low
}

public enum Status
{
    Pending = 1,
    ToDo,
    InProgress,
    Completed,
    OnHold
}

public enum ApprovalAction
{
    Pending = 1,
    Approved,
    Rejected
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

public enum AssignStatus
{
    NotYetArrived = 1,
    AssignedLate,
    AssignedOnTime
}

public enum Severity
{
    Low = 1,
    Medium,
    High,
    Critical
}

[Flags]
public enum BaggageIncidentType
{
    None = 0,
    Damaged = 1,      // 2^0
    Tagless = 2,      // 2^1
    Pilfered = 4,     // 2^2
}

public enum IncidentCategory
{
    BaggageIncident = 1, 
    AirCraftIncident, 
    TheftIncident   ,
    InjuryIncident  ,
    VehicleIncident
}

public enum IncidentStatus
{
    Documented = 1,
    Reported,       
    UnderInvestigation, 
    Resolved, 
    AwaitingAction, 
    Escalated,    
    Canceled,
}
public enum StolenItemCategory
{
    Bag = 1,
    Cargo,
    Mail,
    Other
}
public enum EntityType
{
    Incident = 1,
    Investigation,
    OffloadBaggage,
    LostAndFound,
    WeaponAlert
}

public enum FileType
{
    Image = 1,
    Pdf,
    Other,
    Excel,
    Word,
}

public enum OffloadItemCategory
{
    Bag = 1,
    Cargo,
    Other
}

public enum AssignmentStatus
{
    Pending = 1,
    Active,
    InActive,
    Reassigned,
    Removed
}

public enum EscortType
{
    Vip = 1,
    Cargo,
    LandSide,
    InFlight,
    Other
}