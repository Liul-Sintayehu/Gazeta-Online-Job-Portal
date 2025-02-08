using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound
{
    public record DeleteLostAndFoundItem(long Id) : IRequest<OperationResult<LostAndFoundItem>>;
    internal class DeletelostAndFoundItemHandler(IRepositoryBase<LostAndFoundItem> lostAndFoundItemRepo)
        : IRequestHandler<DeleteLostAndFoundItem, OperationResult<LostAndFoundItem>>
    {
        public async Task<OperationResult<LostAndFoundItem>> Handle(DeleteLostAndFoundItem request, CancellationToken cancellationToken)
        {
            var result = new OperationResult<LostAndFoundItem>();
            var lostAndFoundItem = await lostAndFoundItemRepo.FirstOrDefaultAsync(x => x.Id == request.Id);

            if (lostAndFoundItem == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }

            if (lostAndFoundItem.IsReadOnly == true)
            {
                result.AddError(ErrorCode.ServerError, "Record cannot be deleted.");
                return result;
            }

            lostAndFoundItem.Delete();
            await lostAndFoundItemRepo.UpdateAsync(lostAndFoundItem);

            result.Payload = lostAndFoundItem;
            result.Message = "Operation success";
            return result;
        }
    }
}
