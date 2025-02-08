using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Application.Queries.Attachments;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Queries.LostAndFound;

public record GetAllLostAndFoundItem(GetLostAndFoundItemsQueryDto Dto)
    : IRequest<OperationResult<List<LostAndFoundItem>>>;

internal class GetAllLostAndFoundItemHandler(
    IRepositoryBase<LostAndFoundItem> lostAndFoundRepo,
    IMediator mediator
) : IRequestHandler<GetAllLostAndFoundItem, OperationResult<List<LostAndFoundItem>>>
{
    public async Task<OperationResult<List<LostAndFoundItem>>> Handle(GetAllLostAndFoundItem request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<LostAndFoundItem>>();

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

        if (request.Dto is { PageNumber: > 0, PageSize: > 0 })
        {
            var skip = (request.Dto.PageNumber.Value - 1) * request.Dto.PageSize.Value;
            lostAndFoundItemsQuery = lostAndFoundItemsQuery.Skip(skip).Take(request.Dto.PageSize.Value);
        }

        var lostAndFoundItems = await lostAndFoundItemsQuery
            .Include(i => i.RecordedByOfficer)
            .ThenInclude(i => i.Position)
            .ToListAsync(cancellationToken);

        foreach (var lostAndFoundItem in lostAndFoundItems)
        {
            var attachments =
                await mediator.Send(
                    new GetAttachmentsByRelatedEntityId(lostAndFoundItem.Id, EntityType.LostAndFound),
                    cancellationToken);

            lostAndFoundItem.Attachments.AddRange(attachments);
        }

        result.Payload = lostAndFoundItems;
        result.Message = "Operation success";
        return result;
    }
}