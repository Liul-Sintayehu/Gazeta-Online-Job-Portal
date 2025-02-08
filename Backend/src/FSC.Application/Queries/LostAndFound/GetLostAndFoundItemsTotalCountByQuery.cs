using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Queries.LostAndFound;

public record GetLostAndFoundItemsTotalCountByQuery(GetLostAndFoundItemsQueryDto Dto) : IRequest<OperationResult<int>>;

internal class GetLostAndFoundItemsTotalCountByQueryHandler(
    IRepositoryBase<LostAndFoundItem> lostAndFoundRepo)
    : IRequestHandler<GetLostAndFoundItemsTotalCountByQuery, OperationResult<int>>
{
    public async Task<OperationResult<int>> Handle(GetLostAndFoundItemsTotalCountByQuery request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<int>();

        var lostAndFoundItemsQuery = lostAndFoundRepo.Query();

        if (request.Dto.EndFoundDate.HasValue)
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i =>
                i.DateTimeFound >= request.Dto.StartFoundDate
                && i.DateTimeFound <= request.Dto.EndFoundDate);
        else
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i =>
                i.DateTimeFound.Date == request.Dto.StartFoundDate.Date);

        if (!string.IsNullOrEmpty(request.Dto.FlightNumber))
            lostAndFoundItemsQuery =
                lostAndFoundItemsQuery.Where(i =>
                    i.FlightNumber != null
                    && i.FlightNumber.Contains(request.Dto.FlightNumber));

        if (!string.IsNullOrEmpty(request.Dto.ReferenceNumber))
            lostAndFoundItemsQuery =
                lostAndFoundItemsQuery.Where(i => i.ReferenceNumber.Contains(request.Dto.ReferenceNumber));

        if (!string.IsNullOrEmpty(request.Dto.ItemName))
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i => i.ItemName.Contains(request.Dto.ItemName));

        if (!string.IsNullOrEmpty(request.Dto.Category))
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i => i.Category.Contains(request.Dto.Category));

        if (!string.IsNullOrEmpty(request.Dto.AgentName))
            lostAndFoundItemsQuery =
                lostAndFoundItemsQuery.Where(i => i.AgentName != null && i.AgentName.Contains(request.Dto.AgentName));

        if (!string.IsNullOrEmpty(request.Dto.ReceiptNumber))
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i =>
                i.ReceiptNumber != null
                && i.ReceiptNumber.Contains(request.Dto.ReceiptNumber));

        if (request.Dto.IsConfirmed.HasValue)
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Where(i =>
                i.ConfirmationSignature != null
                && !string.IsNullOrEmpty(i.ConfirmationSignature));

        lostAndFoundItemsQuery = request.Dto.RecordStatus.HasValue
            ? lostAndFoundItemsQuery.Where(i => i.RecordStatus == request.Dto.RecordStatus.Value)
            : lostAndFoundItemsQuery.Where(i => i.RecordStatus != RecordStatus.Deleted);

        result.Payload = await lostAndFoundItemsQuery.CountAsync(cancellationToken);
        return result;
    }
}