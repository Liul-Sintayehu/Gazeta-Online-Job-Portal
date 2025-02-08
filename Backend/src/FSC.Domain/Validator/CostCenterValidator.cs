using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator
{
    public class CostCenterValidator : AbstractValidator<CostCenter>
    {
        public CostCenterValidator()
        {

            RuleFor(x => x.Name)
                  .NotNull().WithMessage("Name can't be null")
                  .NotEmpty().WithMessage("Name can't be empty");
        }

    }
}

