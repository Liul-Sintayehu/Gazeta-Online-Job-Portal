using FSC.Domain.Models.EmployeeAssignments;
using FSC.Domain.Models.Master;

namespace FSC.Domain.Validator.EmployeeAssignments;

public class EscortValidation : AbstractValidator<Escort>
{
    public EscortValidation()
    {
        RuleFor(e => e.Name).NotEmpty().WithMessage("Name cannot be empty").NotNull().WithMessage("Name cannot be Null");
        
        RuleFor(e => e.Location).NotEmpty().WithMessage("Location cannot be empty").NotNull().WithMessage("Location cannot be Null");
        
        RuleFor(e => e.Type).NotEmpty().WithMessage("Type cannot be empty").NotNull().WithMessage("Type cannot be Null").IsInEnum().WithMessage("Type must be a valid enum");
        
        RuleFor(e => e.StartFrom).NotEmpty().WithMessage("StartFrom cannot be empty").NotNull().WithMessage("StartFrom cannot be Null");
        RuleFor(e => e.EndTo).NotEmpty().WithMessage("EndTo cannot be empty").NotNull().WithMessage("End To cannot be Null").GreaterThan(e => e.StartFrom).WithMessage("End To must be greater than StartFrom");
    }
}