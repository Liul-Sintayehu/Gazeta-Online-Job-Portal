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
using FSC.Domain.Models.Master;
using FSC.Domain.Models.WeaponAlert;
using Microsoft.Extensions.Configuration;
using FSC.Domain.Models.Notifications;
using FSC.Domain.Models.OffloadBaggages;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Infrastructure.Context
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        //private readonly ITenant _tenant;
        //public ApplicationDbContext(DbContextOptions options, ITenant tenant) : base(options)=> _tenant= tenant;
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(_tenant.GetDbConnectionString());
        //}

        private readonly IConfiguration _configuration;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration configuration) : this(options) => _configuration = configuration;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseSqlServer(_configuration.GetConnectionString("FSC"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // modelBuilder.Entity<Approval>()
            //     .HasOne(a => a.ClearanceAssignment) 
            //     .WithMany() 
            //     .HasForeignKey(a => a.ClearanceAssignmentId) 
            //     .OnDelete(DeleteBehavior.NoAction); 
            
            // modelBuilder.Entity<ClearanceAssignment>()
            //     .HasOne(a => a.SecurityTeamLeader) 
            //     .WithMany() 
            //     .HasForeignKey(a => a.SecurityTeamLeaderId) 
            //     .OnDelete(DeleteBehavior.NoAction);
            
            // modelBuilder.Entity<ApprovalLog>()
            //     .HasOne(al => al.MajorFlightTaskAssignment)
            //     .WithMany(mf => mf.ApprovalLogs)
            //     .HasForeignKey(al => al.MajorFlightTaskAssignmentId)
            //     .OnDelete(DeleteBehavior.NoAction);

            // modelBuilder.Entity<Weapon>()
            //     .HasOne(weapon => weapon.FlightSchedule)
            //     .WithMany()
            //     .HasForeignKey(mf => mf.FlightScheduleId)
            //     .OnDelete(DeleteBehavior.NoAction);

            // modelBuilder.Entity<WeaponHandling>()
            //     .HasOne(wh => wh.ResponsibleOfficer)
            //     .WithMany()
            //     .HasForeignKey(wh => wh.ResponsibleOfficerId)
            //     .OnDelete(DeleteBehavior.NoAction);
            
            // modelBuilder.Entity<WeaponHandling>()
            //     .HasOne(wh => wh.AssignedBy)
            //     .WithMany()
            //     .HasForeignKey(wh => wh.AssignedById)
            //     .OnDelete(DeleteBehavior.NoAction);
            //
            // modelBuilder.Entity<WeaponHandling>()
            //     .HasOne(wh => wh.FlightSchedule)
            //     .WithMany()
            //     .HasForeignKey(wh => wh.FlightScheduleId)
            //     .OnDelete(DeleteBehavior.NoAction);
            
            // Incident Handling Model Builder Configurations
            // modelBuilder.Entity<Incident>()
            //     .ToTable("Incidents");
            // modelBuilder.Entity<BaggageIncident>()
            //     .ToTable("BaggageIncidents"); 
            // modelBuilder.Entity<AirCraftIncident>()
            //     .ToTable("AirCraftIncidents");
            // modelBuilder.Entity<TheftIncident>()
            //     .ToTable("TheftIncidents");
            // modelBuilder.Entity<InjuryIncident>()
            //     .ToTable("InjuryIncidents");
            // modelBuilder.Entity<VehicleIncident>()
            //     .ToTable("VehicleIncidents");
            //
            // modelBuilder.Entity<Investigation>()
            //     .ToTable("Investigations")
            //     .HasOne(i => i.Incident)
            //     .WithMany(i => i.Investigations) 
            //     .HasForeignKey(i => i.IncidentId);
            
            // modelBuilder.Entity<Suspect>()
            //     .HasOne(s => s.Investigation)
            //     .WithMany(i => i.Suspects)
            //     .HasForeignKey(s => s.InvestigationId)
            //     .OnDelete(DeleteBehavior.Cascade);
            //
            // modelBuilder.Entity<Witness>()
            //     .HasOne(w => w.Investigation)
            //     .WithMany(i => i.Witnesses)
            //     .HasForeignKey(w => w.InvestigationId)
            //     .OnDelete(DeleteBehavior.Cascade); 
            //
            // modelBuilder.Entity<Escort>()
            //     .HasOne(wh => wh.RecordedBy)
            //     .WithMany()
            //     .HasForeignKey(wh => wh.RecordedById)
            //     .OnDelete(DeleteBehavior.NoAction);
        }

        // Master Data
        public DbSet<AuditEventLog> AuditEventLogs { get; set; }
        // public DbSet<CostCenter> CostCenters { get; set; }
        public DbSet<AircraftType> AircraftTypes { get; set; }
        // public DbSet<MajorTask> MajorTasks { get; set; }
        // public DbSet<Position> Positions { get; set; }
        public DbSet<Employee> Employees { get; set; }
        // public DbSet<FlightSchedule> FlightSchedules { get; set; }
        // public DbSet<SubTask> SubTasks { get; set; }

        // Assignment and Approval
        // public DbSet<MajorFlightTaskAssignment> MajorFlightTaskAssignments { get; set; }
        // public DbSet<FlightClearanceAssignment> FlightClearanceAssignments { get; set; }
        // public DbSet<ApprovalLog> ApprovalLogs { get; set; }
        
        // public DbSet<ClearanceAssignment> ClearanceAssignments { get; set; }
        // public DbSet<ClearanceSubTaskAssignment> ClearanceSubTaskAssignments { get; set; }
        // public DbSet<Approval> Approvals { get; set; }

        // Notification
        public DbSet<Notification> Notifications { get; set; }

        // Weapon Handling
        // public DbSet<Weapon> Weapons { get; set; }
        // public DbSet<WeaponHandling> WeaponHandlings { get; set; }
        
        // Attachment   
        public DbSet<Attachment> Attachments { get; set; }
        
        // Incident Handling
        // public DbSet<Incident> Incidents { get; set; }
        // public DbSet<BaggageIncident> BaggageIncidents { get; set; }
        // public DbSet<AirCraftIncident> AirCraftIncidents { get; set; }
        // public DbSet<TheftIncident> TheftIncidents { get; set; }
        // public DbSet<InjuryIncident> InjuryIncidents { get; set; }
        // public DbSet<VehicleIncident> VehicleIncidents { get; set; }

        // Investigations
        // public DbSet<Investigation> Investigations { get; set; }
        // public DbSet<Witness> Witnesses { get; set; }
        // public DbSet<Suspect> Suspects { get; set; }
        
        // Offload Baggage
        // public DbSet<OffloadBaggage> OffloadBaggages { get; set; }

        //LostAndFound
        public DbSet<LostAndFoundItem> LostAndFoundItems { get; set; }
        
        //Officer Assignment
        // public DbSet<Post> Posts { get; set; }
        // public DbSet<PostAssignment> PostAssignments { get; set; }
        //
        // public DbSet<Escort> Escorts { get; set; }
        // public DbSet<EscortAssignment> EscortAssignments { get; set; }
    }
}
