using FSC.Domain.Models.Attachments;

namespace FSC.Application.Queries.Attachments;

public record GetAttachmentsByRelatedEntityId(long RelatedEntityId, EntityType RelatedEntityType)
    : IRequest<List<Attachment>>;
    
internal class GetAttachmentsByRelatedEntityIdQueryHandler(
    IRepositoryBase<Attachment> attachmentRepo
): IRequestHandler<GetAttachmentsByRelatedEntityId, List<Attachment>>
{
    public async Task<List<Attachment>> Handle(GetAttachmentsByRelatedEntityId request, CancellationToken cancellationToken)
    {
        var result = new List<Attachment>();
        
        var attachments = await attachmentRepo.Where(file => 
            file.RelatedEntityId == request.RelatedEntityId
            && file.RelatedEntityType == request.RelatedEntityType
            && file.RecordStatus != RecordStatus.Deleted)
            .ToListAsync(cancellationToken);
        
        result.AddRange(attachments);
        return result;
    }
}