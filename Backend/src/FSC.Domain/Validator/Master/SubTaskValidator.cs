using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator.Master;

public class SubTaskValidator : AbstractValidator<SubTask>
{
    public SubTaskValidator()
    {
        RuleFor(x => x.Name)
                  .NotNull().WithMessage("Name can't be null")
                  .NotEmpty().WithMessage("Name can't be empty");
    }
}