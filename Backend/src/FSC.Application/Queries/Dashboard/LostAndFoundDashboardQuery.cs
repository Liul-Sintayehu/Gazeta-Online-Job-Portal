using FSC.Application.Models.Dtos.Dashboard.Request;
using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Queries.Dashboard;

public record LostAndFoundDashboardQuery(LostAndFoundDashboardRequestDto Dto): IRequest<OperationResult<List<LostAndFoundDashboardResponseDto>>>;

internal class LostAndFoundDashboardQueryHandler(IRepositoryBase<LostAndFoundItem> lostAndFoundRepo): IRequestHandler<LostAndFoundDashboardQuery, OperationResult<List<LostAndFoundDashboardResponseDto>>>
{
    public async Task<OperationResult<List<LostAndFoundDashboardResponseDto>>> Handle(
        LostAndFoundDashboardQuery request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<List<LostAndFoundDashboardResponseDto>>();

        if (!request.Dto.StartDate.HasValue || !request.Dto.EndDate.HasValue)
        {
            result.AddError(ErrorCode.ValidationError, "Start date and End date are required!");
            return result;
        }

        var lostAndFoundItems = await lostAndFoundRepo.Where(item =>
            item.RecordStatus != RecordStatus.Deleted
            && item.DateTimeFound.Date >= request.Dto.StartDate.Value.Date
            && item.DateTimeFound.Date <= request.Dto.EndDate.Value.Date)
            .Select(item => new LostAndFoundDashboardResponseDto()
            {
                Date = item.RegisteredDate,
                Items = item.Amount,
                Shift = item.Shift,
                Price = item.Price ?? "0",
                IsConfirmed = item.ConfirmationSignature != null
            }).ToListAsync(cancellationToken);
        
        result.Payload = lostAndFoundItems;
        return result;
    }
}