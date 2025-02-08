// using FSC.Application.Models.Dtos.CrewManager;
// using FSC.Application.Models.Dtos.SapDataTables;
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

namespace FSC.API.Registrars
{
    public class RepositoryRegistrar : IWebApplicationBuilderRegistrar
    {
        public void RegisterServices(WebApplicationBuilder builder)
        {
            builder.Services.AddScoped(typeof(IRepositoryBase<Position>), typeof(RepositoryBase<Position>));
            builder.Services.AddScoped(typeof(IRepositoryBase<CostCenter>), typeof(RepositoryBase<CostCenter>));
            builder.Services.AddScoped(typeof(IRepositoryBase<AircraftType>), typeof(RepositoryBase<AircraftType>));
            builder.Services.AddScoped(typeof(IRepositoryBase<Employee>), typeof(RepositoryBase<Employee>));
            builder.Services.AddScoped(typeof(IRepositoryBase<FlightSchedule>), typeof(RepositoryBase<FlightSchedule>));
            builder.Services.AddScoped(typeof(IRepositoryBase<MajorTask>), typeof(RepositoryBase<MajorTask>));
            builder.Services.AddScoped(typeof(IRepositoryBase<SubTask>), typeof(RepositoryBase<SubTask>));

            builder.Services.AddScoped(typeof(IRepositoryBase<FlightClearanceAssignment>), typeof(RepositoryBase<FlightClearanceAssignment>));
            builder.Services.AddScoped(typeof(IRepositoryBase<MajorFlightTaskAssignment>), typeof(RepositoryBase<MajorFlightTaskAssignment>));
            builder.Services.AddScoped(typeof(IRepositoryBase<ApprovalLog>), typeof(RepositoryBase<ApprovalLog>));
            
            builder.Services.AddScoped(typeof(IRepositoryBase<ClearanceAssignment>), typeof(RepositoryBase<ClearanceAssignment>));
            builder.Services.AddScoped(typeof(IRepositoryBase<ClearanceSubTaskAssignment>), typeof(RepositoryBase<ClearanceSubTaskAssignment>));
            builder.Services.AddScoped(typeof(IRepositoryBase<Approval>), typeof(RepositoryBase<Approval>));

            builder.Services.AddScoped(typeof(IRepositoryBase<Weapon>), typeof(RepositoryBase<Weapon>));
            builder.Services.AddScoped(typeof(IRepositoryBase<WeaponHandling>), typeof(RepositoryBase<WeaponHandling>));
            builder.Services.AddScoped(typeof(IRepositoryBase<Notification>), typeof(RepositoryBase<Notification>));

            builder.Services.AddScoped(typeof(IRepositoryBase<Attachment>), typeof(RepositoryBase<Attachment>));

            builder.Services.AddScoped(typeof(IRepositoryBase<Incident>), typeof(RepositoryBase<Incident>));
            builder.Services.AddScoped(typeof(IRepositoryBase<BaggageIncident>), typeof(RepositoryBase<BaggageIncident>));
            builder.Services.AddScoped(typeof(IRepositoryBase<TheftIncident>), typeof(RepositoryBase<TheftIncident>));
            builder.Services.AddScoped(typeof(IRepositoryBase<AirCraftIncident>), typeof(RepositoryBase<AirCraftIncident>));
            builder.Services.AddScoped(typeof(IRepositoryBase<InjuryIncident>), typeof(RepositoryBase<InjuryIncident>));
            builder.Services.AddScoped(typeof(IRepositoryBase<VehicleIncident>), typeof(RepositoryBase<VehicleIncident>));

            builder.Services.AddScoped(typeof(IRepositoryBase<Investigation>), typeof(RepositoryBase<Investigation>));
            builder.Services.AddScoped(typeof(IRepositoryBase<Suspect>), typeof(RepositoryBase<Suspect>));
            builder.Services.AddScoped(typeof(IRepositoryBase<Witness>), typeof(RepositoryBase<Witness>));

            builder.Services.AddScoped(typeof(IRepositoryBase<LostAndFoundItem>), typeof(RepositoryBase<LostAndFoundItem>));

            builder.Services.AddScoped(typeof(IRepositoryBase<OffloadBaggage>), typeof(RepositoryBase<OffloadBaggage>));
            
            builder.Services.AddScoped(typeof(IRepositoryBase<Post>), typeof(RepositoryBase<Post>));
            builder.Services.AddScoped(typeof(IRepositoryBase<PostAssignment>), typeof(RepositoryBase<PostAssignment>));
            
            builder.Services.AddScoped(typeof(IRepositoryBase<Escort>), typeof(RepositoryBase<Escort>));
            builder.Services.AddScoped(typeof(IRepositoryBase<EscortAssignment>), typeof(RepositoryBase<EscortAssignment>));

            // builder.Services.AddScoped(typeof(IRepositoryBase<EmployeeLeave>), typeof(RepositoryBase<EmployeeLeave>));
            // builder.Services.AddScoped(typeof(IRepositoryBase<EmployeeShift>), typeof(RepositoryBase<EmployeeShift>));
            //
            // builder.Services.AddScoped(typeof(IRepositoryBase<Crew>), typeof(RepositoryBase<Crew>));
        }
    }
}
