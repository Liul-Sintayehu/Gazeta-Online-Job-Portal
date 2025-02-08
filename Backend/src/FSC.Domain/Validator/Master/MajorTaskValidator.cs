using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator.Master;
public class MajorTaskValidator: AbstractValidator<MajorTask>
{
    public MajorTaskValidator()
    {
        RuleFor(majorTask => majorTask.Name)
            .NotNull().WithMessage("Name can't be null")
            .NotEmpty().WithMessage("Name can't be empty");
    }
}