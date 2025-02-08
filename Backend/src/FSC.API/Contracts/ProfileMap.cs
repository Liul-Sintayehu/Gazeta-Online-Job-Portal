// using FSC.API.Contracts.Resolvers;
using FSC.Application.Models.Dots.Master.AircraftTypes;
// using FSC.Application.Models.Dots.Master.CostCenters;
// using FSC.Application.Models.Dots.Master.Positions;
// using FSC.Application.Models.Dtos.Approvals.Response;
// using FSC.Application.Models.Dtos.Assignments.ClearanceAssignments.Response;
// using FSC.Application.Models.Dtos.Assignments.ClearanceSubTaskAssignments.Response;
using FSC.Application.Models.Dtos.Attachments.Response;
// using FSC.Application.Models.Dtos.EmployeeAssignments.Escorts.Response;
// using FSC.Application.Models.Dtos.EmployeeAssignments.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.AirCraftIncidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.BaggageIncidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.Incidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.InjuryIncidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.Investigations.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.Suspects.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.TheftIncidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.VehicleIncidents.Response;
// using FSC.Application.Models.Dtos.IncidentHandling.Witnesses.Response;
using FSC.Application.Models.Dtos.LostAndFound.Response;
using FSC.Application.Models.Dtos.Master.Employees;
// using FSC.Application.Models.Dtos.Master.FlightSchedules;
// using FSC.Application.Models.Dtos.Master.MajorTasks;
// using FSC.Application.Models.Dtos.Master.SubTasks;
using FSC.Application.Models.Dtos.Notifications.Response;
// using FSC.Application.Models.Dtos.OffloadBaggages.Response;
// using FSC.Application.Models.Dtos.WeaponAlert.Response;
using FSC.Domain.Models.Approvals;
using FSC.Domain.Models.Assignment;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Models.EmployeeAssignments;
using FSC.Domain.Models.IncidentHandling.Incidents;
using FSC.Domain.Models.IncidentHandling.Incidents.AirCraftIncidents;
using FSC.Domain.Models.IncidentHandling.Incidents.BaggageIncidents;
using FSC.Domain.Models.IncidentHandling.Incidents.InjuryIncidents;
using FSC.Domain.Models.IncidentHandling.Incidents.TheftIncidents;
using FSC.Domain.Models.IncidentHandling.Incidents.VehicleIncidents;
using FSC.Domain.Models.IncidentHandling.Investigations;
using FSC.Domain.Models.LostAndFound;
using FSC.Domain.Models.Master;
using FSC.Domain.Models.Notifications;
using FSC.Domain.Models.OffloadBaggages;
using FSC.Domain.Models.WeaponAlert;

namespace FSC.API.Contracts;
public class ProfileMap : Profile
{
    public ProfileMap()
    {
        // CreateMap<CostCenter, CostCenterDetailDto>();
        CreateMap<AircraftType, AircraftTypeDetailDto>();
        // CreateMap<Position, PositionDetailDto>();
        CreateMap<Employee, EmployeeDetailDto>();
        
        // CreateMap<FlightSchedule, FlightScheduleDetailDto>();
        // CreateMap<MajorTask, MajorTaskDetailDto>();
        // CreateMap<SubTask, SubTaskDetailDto>();
        //
        // CreateMap<ClearanceAssignment, ClearanceAssignmentResponseDto>();
        // CreateMap<ClearanceSubTaskAssignment, ClearanceSubTaskAssignmentResponseDto>();
        // CreateMap<Approval, ApprovalResponseDto>();
        // CreateMap<ClearanceAssignmentApprovals, ClearanceAssignmentApprovalResponseDto>();
        //
        // CreateMap<ApprovalLog, ApprovalDetailDto>();
        // CreateMap<ApprovalLog, ApprovalLogResponse>();
        // CreateMap<LatestApprovalsWithStatus, LatestApprovalsWithStatusResponseDto>();
        //
        // CreateMap<Weapon, WeaponResponseDto>();
        // CreateMap<WeaponHandling, WeaponAlertResponseDto>();
        
        CreateMap<Notification, NotificationListResponseDto>();
        CreateMap<Notification, NotificationDetailResponseDto>();

        CreateMap<Attachment, AttachmentResponseDto>();
        
        // CreateMap<Incident, IncidentDto>();
        // CreateMap<BaggageIncident, BaggageIncidentResponseDto>()
        //     .ForMember(dest => dest.Bags, opt => 
        //         opt.MapFrom<BagsResolver>());
        // CreateMap<TheftIncident, TheftIncidentResponseDto>()
        //     .ForMember(dest => dest.Exhibits, opt =>
        //         opt.MapFrom<ExhibitsResolver>());
        // CreateMap<AirCraftIncident, AirCraftIncidentResponseDto>();
        // CreateMap<InjuryIncident, InjuryIncidentResponseDto>();
        // CreateMap<VehicleIncident, VehicleIncidentResponseDto>();
        //
        // CreateMap<Investigation, InvestigationResponseDto>();
        // CreateMap<Suspect, SuspectResponseDto>();
        // CreateMap<Witness, WitnessResponseDto>();
        //
        // CreateMap<OffloadBaggage, OffloadBaggageResponseDto>();
        
        CreateMap<LostAndFoundItem, LostAndFoundItemDetailDto>();
        
        // CreateMap<Post, PostResponseDto>();
        // CreateMap<PostAssignment, PostAssignmentResponseDto>();
        //
        // CreateMap<Escort, EscortResponseDto>();
        // CreateMap<EscortAssignment, EscortAssignmentResponseDto>();
    }
}
