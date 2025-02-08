using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator.Master
{
    public class AircraftTypeValidator : AbstractValidator<AircraftType>
    {
        public AircraftTypeValidator()
        {

            RuleFor(x => x.AircraftTypeCode)
                  .NotNull().WithMessage("Code can't be null")
                  .NotEmpty().WithMessage("Code can't be empty");
        }
    }
}
