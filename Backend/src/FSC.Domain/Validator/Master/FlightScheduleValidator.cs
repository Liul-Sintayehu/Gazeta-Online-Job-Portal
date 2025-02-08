using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator.Master
{
    public class FlightScheduleValidator : AbstractValidator<FlightSchedule>
    {
        public FlightScheduleValidator()
        {

            RuleFor(x => x.FlightNumber)
                  .NotNull().WithMessage("Flight Number can't be null")
                  .NotEmpty().WithMessage("Flight Number can't be empty");

            RuleFor(x => x.FlightLegReferenceNumber)
                .NotNull().WithMessage("Flight Date can't be null")
                .NotEmpty().WithMessage("Flight Date can't be empty");
        }
    }
}
