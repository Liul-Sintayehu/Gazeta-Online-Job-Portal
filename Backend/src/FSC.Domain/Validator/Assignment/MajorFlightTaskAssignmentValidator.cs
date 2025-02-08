using FSC.Domain.Models.Assignment;

namespace FSC.Domain.Validator.Assignment
{
    public class MajorFlightTaskAssignmentValidator : AbstractValidator<MajorFlightTaskAssignment>
    {
        public MajorFlightTaskAssignmentValidator()
        {
            RuleFor(x => x.SecurityTeamLeader)
                  .NotNull().WithMessage("Employee can't be null");

            RuleFor(x => x.MajorTaskId)
                 .NotNull().WithMessage("Major task can't be null");

            RuleFor(x => x.FlightScheduleId)
                .NotNull().WithMessage("There must be flight schedule");
        }
    }
}
