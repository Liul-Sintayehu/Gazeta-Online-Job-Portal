using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Attachments;
using FSC.Domain.Validator.IncidentHandling;
using Severity = FSC.Domain.Common.Severity;

namespace FSC.Domain.Models.IncidentHandling.Incidents.VehicleIncidents
{
    public class VehicleIncident : Incident
    {
        public string LicensePlate { get; set; } = string.Empty;
        public string DamagedPart { get; set; } = string.Empty;
        public string CollisionObject { get; set; } = string.Empty;
        public string? CollidedVehicleLicensePlate { get; set; } 
        public bool AlcoholTestConducted { get; set; }
        public bool AlcoholTestResult { get; set; } 
        public string? AlcoholAmount { get; set; } 

        
        [NotMapped]
        public List<Attachment> Attachments { get; set; } = []; 
        
        public static VehicleIncident Create(
            DateTime incidentDate,
            string? description,
            string? location,
            Severity severity,
            
            string licensePlate,
            string damagedPart,
            string collisionObject,
            string? secondLicensePlate,
            bool alcoholTestConducted,
            bool alcoholTestResult,
            string? alcoholAmount,
            
            long recordedByOfficerId
        )
        {
            var vehicleIncident = new VehicleIncident
            {
                IncidentCategory = IncidentCategory.VehicleIncident,
                IncidentStatus = IncidentStatus.AwaitingAction,

                IncidentDate = incidentDate,
                Description = description,
                Location = location,
                Severity = severity,

                DamagedPart = damagedPart,
                LicensePlate = licensePlate,
                CollidedVehicleLicensePlate = secondLicensePlate,
                CollisionObject = collisionObject,
                AlcoholTestConducted = alcoholTestConducted,
                AlcoholTestResult = alcoholTestResult,
                AlcoholAmount = alcoholAmount,
                
                RecordedByOfficerId = recordedByOfficerId
            };

            var validator = new VehicleIncidentValidator();
            var response = validator.Validate(vehicleIncident);

            if (response.IsValid)
            {
                vehicleIncident.Register();
                return vehicleIncident;
            }

            var errors = new NotValidException();
            response.Errors.ForEach(failure => errors.ValidationErrors.Add(failure.ErrorMessage));
            throw errors;
        }

        public void Update(
            DateTime incidentDate,
            string? description,
            string? location,
            Severity severity,
            
            string licensePlate,
            string damagedPart,
            string? secondLicensePlate,
            string collisionObject,
            bool alcoholTestConducted,
            bool alcoholTestResult,
            string? alcoholAmount,

            IncidentStatus incidentStatus,
            string? resolution,
            string? remark
        )
        {
            IncidentDate = incidentDate;
            Description = description;
            Location = location;
            Severity = severity;

            DamagedPart = damagedPart;
            LicensePlate = licensePlate;
            CollidedVehicleLicensePlate = secondLicensePlate;
            CollisionObject = collisionObject;
            AlcoholTestConducted = alcoholTestConducted;
            AlcoholTestResult = alcoholTestResult;
            AlcoholAmount = alcoholAmount;

            if (incidentStatus != IncidentStatus)
            {
                UpdateIncidentStatus(incidentStatus, resolution, remark);
            }

            var validator = new VehicleIncidentValidator();
            var response = validator.Validate(this);

            if (response.IsValid)
            {
                UpdateAudit();
                return;
            }

            var errors = new NotValidException();
            response.Errors.ForEach(failure => errors.ValidationErrors.Add(failure.ErrorMessage));
            throw errors;
        }
    }
}
