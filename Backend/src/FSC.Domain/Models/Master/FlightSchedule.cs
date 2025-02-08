using FSC.Domain.Models.Assignment;

namespace FSC.Domain.Models.Master
{
    public class FlightSchedule : BaseEntity
    {
        public string? FlightNumber { get; set; }
        public string? FlightLegReferenceNumber { get; set; }
        public DateTime? ScheduledDepartureTime { get; set; }
        public string? Carrier { get; set; }
        public string? Suffix { get; set; }
        public string? LatestDeparture { get; set; }
        public DateTime? EstimatedBlockOff { get; set; }
        public DateTime? ActualBlockOff { get; set; }
        public string? LatestArrival { get; set; }
        public DateTime? ScheduledArrivalTime { get; set; }
        public DateTime? EstimatedBlockOn { get; set; }
        public DateTime? ActualBlockOn { get; set; }
        public string? AircraftType { get; set; }
        public string? AircraftRegistration { get; set; }        
        public string? Tail { get; set; }
        public string? PreviousTail { get; set; }
        public string? DepartureGate { get; set; }
        public string? Status { get; set; }
        public string? DepartureParkingStand { get; set; }
        public string? ArrivalGate { get; set; }
        public string? ArrivalParkingStand { get; set; }

        public virtual ClearanceAssignment ClearanceAssignment { get; set; } = null!;
        
        // public ICollection<MajorFlightTaskAssignment> MajorFlightTaskAssignments { get; set; }
    }
}
