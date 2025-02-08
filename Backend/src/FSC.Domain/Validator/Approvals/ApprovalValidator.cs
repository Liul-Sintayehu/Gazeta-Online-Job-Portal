using FSC.Domain.Models.Approvals;

namespace FSC.Domain.Validator.Approvals;

public class ApprovalValidator : AbstractValidator<Approval>
{
    public ApprovalValidator()
    {
        RuleFor(x => x.ClearanceAssignmentId)
            .NotNull().WithMessage("Clearance Assignment can't be null")
            .NotEmpty().WithMessage("Clearance Assignment can't be empty");
        RuleFor(x => x.EmployeeId)
            .NotNull().WithMessage("Employee can't be null")
            .NotEmpty().WithMessage("Employee can't be empty");
    }
}