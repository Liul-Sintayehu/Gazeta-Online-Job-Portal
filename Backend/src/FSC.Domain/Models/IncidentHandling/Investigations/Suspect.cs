using System.ComponentModel.DataAnnotations.Schema;

namespace FSC.Domain.Models.IncidentHandling.Investigations;

public class Suspect: BaseEntity
{
    // Foreign key to the related investigation
    public long InvestigationId { get; set; }         
    [ForeignKey(nameof(InvestigationId))]
    public virtual Investigation Investigation { get; set; }

    // Suspect details
    public DateTime? DateIdentified { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string EmployeeId { get; set; } = string.Empty;
    public string? PersonalPhoneNumber { get; set; } = string.Empty;
    public string? WorkPhoneNumber { get; set; } = string.Empty;
    public string? SupervisorName { get; set; } = string.Empty;
    
    public string? SignaturePath { get; set; }
    public DateTime? SignedOn { get; set; }
    
    public bool? IsPrimarySuspect { get; set; }
}