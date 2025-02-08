using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound.Signature;

public record RemoveAgentSignature(long Id) : IRequest<OperationResult<bool>>;

internal class RemoveAgentSignatureHandler(IRepositoryBase<LostAndFoundItem> lostAndFoundRepo): IRequestHandler<RemoveAgentSignature, OperationResult<bool>>
{
    public async Task<OperationResult<bool>> Handle(RemoveAgentSignature request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<bool>();

        var lostAndFoundItem = await lostAndFoundRepo.Where(inv =>
                inv.Id == request.Id
                && inv.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (lostAndFoundItem == null)
        {
            result.AddError(ErrorCode.NotFound, "Lost and Found item not found!");
            return result;
        }

        lostAndFoundItem.RemoveAgentSignature();
        result.Payload = await lostAndFoundRepo.UpdateAsync(lostAndFoundItem);
        return result;
    }
}