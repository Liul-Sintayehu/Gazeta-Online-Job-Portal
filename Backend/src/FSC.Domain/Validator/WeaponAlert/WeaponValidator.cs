using FSC.Domain.Models.WeaponAlert;

namespace FSC.Domain.Validator.WeaponAlert
{
    public class WeaponValidator : AbstractValidator<Weapon>
    {
        public WeaponValidator()
        {
            RuleFor(w => w.TagNumber)
            .NotNull().WithMessage("Tag Number can't be null!")
            .NotEmpty().WithMessage("Tag Number can't be empty!");

            RuleFor(w => w.PalateNumber)
            .NotNull().WithMessage("Palate Number can't be null!")
            .NotEmpty().WithMessage("Palate Number can't be empty!");

            RuleFor(w => w.AKENumber)
            .NotNull().WithMessage("AKE Number can't be null!")
            .NotEmpty().WithMessage("AKE Number can't be empty!");
        }
    }
}