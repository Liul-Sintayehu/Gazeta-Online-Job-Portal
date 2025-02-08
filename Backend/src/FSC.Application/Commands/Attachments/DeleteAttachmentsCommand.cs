using FSC.Domain.Models.Attachments;

namespace FSC.Application.Commands.Attachments;

public record DeleteAttachmentsCommand(long Id) : IRequest<OperationResult<bool>>;

internal class DeleteAttachmentsCommandHandler(
    IRepositoryBase<Attachment> attachmentRepo
) : IRequestHandler<DeleteAttachmentsCommand, OperationResult<bool>>
{
    public async Task<OperationResult<bool>> Handle(DeleteAttachmentsCommand request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<bool>();

        var attachment = await attachmentRepo.Where(a =>
                a.Id == request.Id && a.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (attachment == null)
        {
            result.AddError(ErrorCode.NotFound, $"Attachment with id: {request.Id} not found");
            return result;
        }

        attachment.Delete();
        result.Payload = await attachmentRepo.UpdateAsync(attachment);
        return result;
    }
}