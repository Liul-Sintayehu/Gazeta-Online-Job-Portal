using System.ComponentModel.DataAnnotations.Schema;
using FSC.Domain.Models.Master;
using FSC.Domain.Validator.EmployeeAssignments;

namespace FSC.Domain.Models.EmployeeAssignments;

public class Escort : BaseEntity
{
    public EscortType Type { get; set; }
    public DateTime StartFrom { get; set; }
    public DateTime EndTo { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<EscortAssignment> Assignments { get; set; } = new List<EscortAssignment>();

    public long RecordedById { get; set; }
    [ForeignKey(nameof(RecordedById))] public Employee RecordedBy { get; set; } = null!;

    public static Escort Create(EscortType type, DateTime startFrom, DateTime endTo, string name, string location,
        string? description, ICollection<EscortAssignment> assignments, long recordedById)
    {
        var escort = new Escort
        {
            Type = type,
            StartFrom = startFrom,
            EndTo = endTo,
            Description = description,
            Name = name,
            Location = location,
            Assignments = assignments,

            RecordedById = recordedById
        };
        var validator = new EscortValidation();
        var response = validator.Validate(escort);
        if (response.IsValid)
        {
            escort.Register();
            return escort;
        }

        var exception = new NotValidException("Escort is invalid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }

    public void Update(EscortType type, DateTime startFrom, DateTime endTo, string name, string location,
        string? description)
    {
        Type = type;
        StartFrom = startFrom;
        EndTo = endTo;
        Description = description;
        Name = name;
        Location = location;

        var validator = new EscortValidation();
        var response = validator.Validate(this);
        if (response.IsValid)
        {
            UpdateAudit();
            return;
        }

        var exception = new NotValidException("Escort is invalid");
        response.Errors.ForEach(vr => exception.ValidationErrors.Add(vr.ErrorMessage));
        throw exception;
    }
}