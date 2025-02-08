using FSC.Application.Models.Dtos.Attachments.Request;
using FSC.Application.Services.Helper;
using FSC.Domain.Models.Attachments;

namespace FSC.Application.Commands.Attachments;

public record CreateAttachmentsCommand(CreateAttachmentRequestDto Dto):IRequest<OperationResult<bool>>;

internal class CreateAttachmentsCommandHandler(
    IRepositoryBase<Attachment> attachmentRepo,
    IFileStorageService fileStorageService
    ):IRequestHandler<CreateAttachmentsCommand,OperationResult<bool>>
{
    public async Task<OperationResult<bool>> Handle(CreateAttachmentsCommand request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<bool>();
            var attachmentRequestDto = request.Dto;
            
            var filePath = await fileStorageService.UploadFileAsync(
                                    attachmentRequestDto.File, 
                                    MapSubFolderWithEntity(attachmentRequestDto.RelatedEntityType)
                                );

            var attachment = Attachment.Create(
                filePath,
                attachmentRequestDto.File.FileName,
                attachmentRequestDto.Caption,
                attachmentRequestDto.File.ContentType,
                attachmentRequestDto.File.Length,
                attachmentRequestDto.RelatedEntityId,
                attachmentRequestDto.RelatedEntityType
            );

        result.Payload = await attachmentRepo.AddAsync(attachment);
        return result;
    }

    private static string MapSubFolderWithEntity(EntityType entityType)
    {
        return entityType switch
        {
            EntityType.Incident => "Attachments/Incidents",
            EntityType.Investigation => "Attachments/Investigations",
            EntityType.OffloadBaggage => "Attachments/OffloadBaggage", 
            EntityType.LostAndFound => "Attachments/LostAndFound",
            _ => "Attachments/Others"
        };
    }
}