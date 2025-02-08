using FSC.Application.Services.Helper;
using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.AircraftTypes;

public record CreateAircraftType(string AircraftTypeCode, string AircraftTypeName)
    : IRequest<OperationResult<AircraftType>>;
internal class CreateAircraftTypeHandler(IRepositoryBase<AircraftType> aircraftTypeRepo, UserService userService)
    : IRequestHandler<CreateAircraftType, OperationResult<AircraftType>>
{
    public async Task<OperationResult<AircraftType>> Handle(CreateAircraftType req, CancellationToken cancellationToken)
    {
        var result = new OperationResult<AircraftType>();

        try
        {
            // Get the authenticated user
            var currentUser = await userService.GetCurrentUserAsync(cancellationToken);
            var userFullName = $"{currentUser.FirstName} {currentUser.MiddleName} {currentUser.LastName} ({currentUser.EmployeeId})";

            // Check if the record already exists
            if (await aircraftTypeRepo.ExistWhereAsync(x => x.AircraftTypeCode == req.AircraftTypeCode && x.RecordStatus != RecordStatus.Deleted))
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Record already exists.");
                return result;
            }

            // Create the AircraftType record
            var aircraftType = AircraftType.Create(req.AircraftTypeCode, req.AircraftTypeName, userFullName);
            await aircraftTypeRepo.AddAsync(aircraftType);

            result.Payload = aircraftType;
            result.Message = "Operation success";
        }
        catch (UnregisteredUserException ex)
        {
            result.AddError(ErrorCode.UnAuthorized, ex.Message);
        }
        catch (NotValidException ex)
        {
            foreach (var validationError in ex.ValidationErrors)
            {
                result.AddError(ErrorCode.ValidationError, validationError);
            }
        }

        return result;
    }
}
