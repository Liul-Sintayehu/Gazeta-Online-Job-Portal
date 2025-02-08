using FSC.Application.Queries.Attachments;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Queries.LostAndFound
{
    public record GetByIdLostAndFoundItem(long Id) : IRequest<OperationResult<LostAndFoundItem>>;

    internal class GetByIdLostAndFoundItemHandler(IRepositoryBase<LostAndFoundItem> lostAndFoundItem,
        IMediator mediator)
        : IRequestHandler<GetByIdLostAndFoundItem, OperationResult<LostAndFoundItem>>
    {
        public async Task<OperationResult<LostAndFoundItem>> Handle(GetByIdLostAndFoundItem req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<LostAndFoundItem>();
            var lostAndFound = await lostAndFoundItem.Where(x => 
                x.Id == req.Id 
                && x.RecordStatus != RecordStatus.Deleted)
                .Include(x => x.RecordedByOfficer)
                .ThenInclude(x => x.Position)
                .FirstOrDefaultAsync(cancellationToken);
            
            if (lostAndFound == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }
            
            var attachments =
                await mediator.Send(
                    new GetAttachmentsByRelatedEntityId(lostAndFound.Id, EntityType.LostAndFound),
                    cancellationToken);

            lostAndFound.Attachments.AddRange(attachments);
            
            result.Payload = lostAndFound;
            result.Message = "Operation success";
            return result;
        }
    }

}