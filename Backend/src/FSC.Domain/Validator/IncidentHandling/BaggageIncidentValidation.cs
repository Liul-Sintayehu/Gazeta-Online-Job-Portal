using FSC.Domain.Helpers;
using FSC.Domain.Models.IncidentHandling.Incidents.BaggageIncidents;

namespace FSC.Domain.Validator.IncidentHandling;

public class BaggageIncidentValidation: AbstractValidator<BaggageIncident>
{
    public BaggageIncidentValidation()
    {
        RuleFor(x => x.IncidentDate)
            .NotNull().WithMessage("Incident date can't be null")
            .NotEmpty().WithMessage("Incident date can't be empty")
            .LessThanOrEqualTo(x => Helper.GetDateTimeNow())
            .WithMessage("Incident date can only be less than or equal to the current date");
        
        RuleFor(x => x.BaggageIncidentType)
            .NotNull().WithMessage("BaggageIncidentType can't be null")
            .NotEmpty().WithMessage("BaggageIncidentType can't be empty")
            // .IsInEnum().WithMessage("Incident date must be a valid enum")
            ;
    }
}