using FSC.Domain.Models.Notifications;
namespace FSC.Domain.Validator.Notifications
{
    public class NotificationValidator : AbstractValidator<Notification>
    {
        public NotificationValidator()
        {
            RuleFor(x => x.Message)
                  .NotNull().WithMessage("Message can't be null")
                  .NotEmpty().WithMessage("Message can't be empty");
            RuleFor(x => x.Subject)
                  .NotNull().WithMessage("Subject can't be null")
                  .NotEmpty().WithMessage("Subject can't be empty");
        }
    }
}
