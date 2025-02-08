using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Queries.LostAndFound
{
    public record GetBySearchLostAndFoundItem(string? itemName, string? referenceNumber) : IRequest<OperationResult<List<LostAndFoundItem>>>;

    internal class GetBySearchLostAndFoundItemHandler : IRequestHandler<GetBySearchLostAndFoundItem, OperationResult<List<LostAndFoundItem>>>
    {
        private readonly IRepositoryBase<LostAndFoundItem> _lostAndFoundItem;
        public GetBySearchLostAndFoundItemHandler(IRepositoryBase<LostAndFoundItem> _lostAndFoundItem) => this._lostAndFoundItem = _lostAndFoundItem;
        public async Task<OperationResult<List<LostAndFoundItem>>> Handle(GetBySearchLostAndFoundItem req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<List<LostAndFoundItem>>();
            var lostAndFoundItems = from r in _lostAndFoundItem.Query() select r;
            if (!string.IsNullOrEmpty(req.itemName))
                lostAndFoundItems = lostAndFoundItems.Where(_ => _.ItemName.Contains(req.itemName));
            if (!string.IsNullOrEmpty(req.referenceNumber))
                lostAndFoundItems = lostAndFoundItems.Where(_ => _.ReferenceNumber.Contains(req.referenceNumber));

            result.Payload = await lostAndFoundItems.Where(_ => _.RecordStatus != RecordStatus.Deleted).ToListAsync();
            result.Message = "Operation success";
            return result;
        }
    }

}

