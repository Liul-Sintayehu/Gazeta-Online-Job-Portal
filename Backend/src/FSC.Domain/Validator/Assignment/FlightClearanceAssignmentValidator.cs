using FSC.Domain.Models.Assignment;

namespace FSC.Domain.Validator.Assignment
{
    public class FlightClearanceAssignmentValidator : AbstractValidator<FlightClearanceAssignment>
    {
        public FlightClearanceAssignmentValidator()
        {
            RuleFor(x => x.AssignedTo)
                .NotNull().WithMessage("You have to assign the task to employee");
            
            RuleFor(x => x.SubTaskId)
                .NotNull().WithMessage("Sub task can't be null");

            RuleFor(x => x.MajorFlightTaskAssignmentId)
                .NotNull().WithMessage("Major task needs to be assigned to a team leader!");

            RuleFor(x => x.AssignedTo)
                .NotNull().WithMessage("ID of Employee to be assigned cannot be null!");
        
            RuleFor(x => x.TaskStatus)
                .NotNull().WithMessage("Status cannot be null!")
                .IsInEnum().WithMessage("Task status must be a valid enum value.");
        }
    }
}
