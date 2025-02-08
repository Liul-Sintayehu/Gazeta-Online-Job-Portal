using FSC.Domain.Models.Attachments;

namespace FSC.Domain.Validator.Attachments;

public class AttachmentValidator: AbstractValidator<Attachment>
{
    public AttachmentValidator()
    {
        RuleFor(a => a.Path)
            .NotEmpty().WithMessage("File path cannot be empty.")
            .NotNull().WithMessage("File path cannot be null.");
        
        RuleFor(a => a.Name)
            .NotEmpty().WithMessage("File name cannot be empty.")
            .NotNull().WithMessage("File name cannot be null.");
        
        RuleFor(a => a.FileType)
            .NotEmpty().WithMessage("File path cannot be empty.")
            .NotNull().WithMessage("File path cannot be null.")
            .IsInEnum().WithMessage("File path must be one of the allowed file types.");
    }
}