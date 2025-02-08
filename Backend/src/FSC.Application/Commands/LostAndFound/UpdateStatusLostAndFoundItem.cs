using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound
{
    public record UpdateStatusLostAndFoundItem(long Id, RecordStatus RecordStatus) : IRequest<OperationResult<LostAndFoundItem>>;
    internal class UpdateStatusLostAndFoundItemHandler(IRepositoryBase<LostAndFoundItem> LostAndFoundItemRepo)
        : IRequestHandler<UpdateStatusLostAndFoundItem, OperationResult<LostAndFoundItem>>
    {
        public async Task<OperationResult<LostAndFoundItem>> Handle(UpdateStatusLostAndFoundItem request, CancellationToken cancellationToken)
        {
            var result = new OperationResult<LostAndFoundItem>();
            var LostAndFoundItem = await LostAndFoundItemRepo.FirstOrDefaultAsync(x => x.Id == request.Id);

            if (LostAndFoundItem is null)
            {
                result.AddError(ErrorCode.NotFound, "No record found,");
                return result;
            }

            LostAndFoundItem.UpdateRecordStatus(request.RecordStatus);
            await LostAndFoundItemRepo.UpdateAsync(LostAndFoundItem);

            result.Payload = LostAndFoundItem;
            result.Message = "Operation success";
            return result;
        }
    }
}
