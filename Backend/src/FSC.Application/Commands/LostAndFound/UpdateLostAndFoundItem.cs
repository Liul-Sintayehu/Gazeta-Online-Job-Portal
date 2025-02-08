using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound
{
    public record UpdateLostAndFoundItem(long Id, LostAndFoundItemDto Dto) : IRequest<OperationResult<LostAndFoundItem>>;
    internal class UpdateLostAndFoundItemHandler(
        IRepositoryBase<LostAndFoundItem> lostAndFoundItemRepo) : IRequestHandler<UpdateLostAndFoundItem, OperationResult<LostAndFoundItem>>
    {
        public async Task<OperationResult<LostAndFoundItem>> Handle(UpdateLostAndFoundItem request, CancellationToken cancellationToken)
        {
            var result = new OperationResult<LostAndFoundItem>();


            var lostAndFound = await lostAndFoundItemRepo.Where(w =>
                w.Id == request.Id
                && w.RecordStatus != RecordStatus.Deleted)
                .FirstOrDefaultAsync(cancellationToken);

            if (lostAndFound is null)
            {
                result.AddError(ErrorCode.NotFound, "lostAndFound not found!");
                return result;
            }

            try{

                lostAndFound.Update(
                         itemName: request.Dto.ItemName,
                         category: request.Dto.Category,
                         foundLocation: request.Dto.FoundLocation,
                         dateTimeFound: request.Dto.DateTimeFound,
                         amount: request.Dto.Amount,
                         price: request.Dto.Price,
                         shift: request.Dto.Shift,
                         agentId: request.Dto.AgentId,
                         agentName: request.Dto.AgentName,
                         receiptNumber: request.Dto.ReceiptNumber,
                         flightNumber: request.Dto.FlightNumber,
                         flightDate: request.Dto.FlightDate,
                         aircraftType: request.Dto.AircraftType,
                         isReturned: request.Dto.IsReturned,
                         securityOfficerName: request.Dto.SecurityOfficerName,
                         securityOfficerId: request.Dto.SecurityOfficerId
                     );

                await lostAndFoundItemRepo.UpdateAsync(lostAndFound);

                result.Payload = lostAndFound;
                result.Message = "lostAndFound successfully updated!";
                return result;
            }
            catch (NotValidException ex)
            {
                foreach (var validationError in ex.ValidationErrors)
                {
                    result.AddError(ErrorCode.ValidationError, validationError);
                }
                return result;
            }
            catch (Exception ex)
            {
               result.AddError(ErrorCode.UnknownError, $"An unexpected error occurred: {ex.Message}");
                return result;
            }
        }
    }
}
