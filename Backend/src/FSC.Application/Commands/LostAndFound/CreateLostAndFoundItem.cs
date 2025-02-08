using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound;

public record CreateLostAndFoundItem(LostAndFoundItemDto Dto) : IRequest<OperationResult<LostAndFoundItem>>;

internal class CreateLostAndFoundItemCommandHandler(
    IRepositoryBase<LostAndFoundItem> lostAndFoundItemRepo) : IRequestHandler<CreateLostAndFoundItem, OperationResult<LostAndFoundItem>>
{
    public async Task<OperationResult<LostAndFoundItem>> Handle(CreateLostAndFoundItem request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<LostAndFoundItem>();
    
        // TODO: Change the employee id with current user's ID
        const long recordedByOfficerId = 38;
            
        try
        {
            // Generated a unique and sequential reference number
            var referenceNumber = await GenerateReferenceNumber(cancellationToken);
            
            var newLostAndFoundItem = LostAndFoundItem.Create(
                referenceNumber: referenceNumber,
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
                securityOfficerId: request.Dto.SecurityOfficerId,
                recordedByOfficerId
            );

            // Add the new LostAndFoundItem entity to the repository
            await lostAndFoundItemRepo.AddAsync(newLostAndFoundItem);

            // Set the success result and return
            result.Payload = newLostAndFoundItem;
            result.Message = "Operation successful";
            return result;
        }
        catch (NotValidException ex)
        {
            // Handle validation errors
            foreach (var validationError in ex.ValidationErrors)
            {
                result.AddError(ErrorCode.ValidationError, validationError);
            }
            return result;
        }
        catch (Exception ex)
        {
            // Handle unexpected errors
            result.AddError(ErrorCode.ServerError, ex.Message);
            return result;
        }
    }

    private async Task<string> GenerateReferenceNumber(CancellationToken cancellationToken)
    {
        var lastReference = await lostAndFoundItemRepo
            .Query()
            .OrderByDescending(item => item.Id) 
            .Select(item => item.ReferenceNumber)
            .FirstOrDefaultAsync(cancellationToken);

        if (string.IsNullOrEmpty(lastReference))
            return "AA0001";
        
        var prefix = lastReference[..^4];
        var numericPart = int.Parse(lastReference[^4..]);

        numericPart++;
        if (numericPart > 9999)
        {
            numericPart = 1;
            prefix = IncrementPrefix(prefix);
        }

        return $"{prefix}{numericPart:D4}";
    }

    private static string IncrementPrefix(string prefix)
    {
        var letters = prefix.ToCharArray();
        for (var i = letters.Length - 1; i >= 0; i--)
        {
            if (letters[i] == 'Z')
            {
                letters[i] = 'A';
            }
            else
            {
                letters[i]++;
                return new string(letters);
            }
        }

        return new string('A', letters.Length + 1);
    }
}