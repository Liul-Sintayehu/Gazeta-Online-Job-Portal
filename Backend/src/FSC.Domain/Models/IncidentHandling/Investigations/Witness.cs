using System.ComponentModel.DataAnnotations.Schema;

namespace FSC.Domain.Models.IncidentHandling.Investigations;

public class Witness : BaseEntity
{
    // Foreign key to the related investigation
    public long InvestigationId { get; set; }
    [ForeignKey(nameof(InvestigationId))]
    public virtual Investigation Investigation { get; set; }

    // Witness details
    public string Name { get; set; } = string.Empty;
    public string IDCardType { get; set; } = string.Empty;
    public string IDCardNumber { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? RoleInIncident { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
    public string? Statement { get; set; } = string.Empty;
    public DateTime? DateOfTestimony { get; set; }

    public string? SignaturePath { get; set; }
    public DateTime? SignedOn { get; set; }
}