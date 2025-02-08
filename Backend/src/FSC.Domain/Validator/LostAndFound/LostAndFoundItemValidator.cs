using FSC.Domain.Models.LostAndFound;

namespace FSC.Domain.Validator.LostAndFound
{
    public class LostAndFoundItemValidator : AbstractValidator<LostAndFoundItem>
    {
        public LostAndFoundItemValidator()
        {
            RuleFor(w => w.ItemName)
            .NotNull().WithMessage("Item can't be null!")
            .NotEmpty().WithMessage("Item can't be empty!");

            RuleFor(w => w.Amount)
            .NotNull().WithMessage("Amount can't be null!");
        }
    }
}