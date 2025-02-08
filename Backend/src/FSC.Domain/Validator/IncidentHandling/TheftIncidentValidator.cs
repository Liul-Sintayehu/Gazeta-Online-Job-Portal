using FSC.Domain.Helpers;
using FSC.Domain.Models.IncidentHandling.Incidents.TheftIncidents;

namespace FSC.Domain.Validator.IncidentHandling;

public class TheftIncidentValidator: AbstractValidator<TheftIncident>
{
    public TheftIncidentValidator()
    {
        RuleFor(x => x.IncidentDate)
            .NotNull().WithMessage("Incident date can't be null")
            .NotEmpty().WithMessage("Incident date can't be empty")
            .LessThanOrEqualTo(x => Helper.GetDateTimeNow())
            .WithMessage("Incident date can only be less than or equal to the current date");
        
        RuleFor(x => x.StolenItemCategory)
            .NotNull().WithMessage("StolenItemCategory can't be null")
            .NotEmpty().WithMessage("StolenItemCategory can't be empty")
            // .IsInEnum().WithMessage("Incident date must be a valid enum")
            ;
    }
}