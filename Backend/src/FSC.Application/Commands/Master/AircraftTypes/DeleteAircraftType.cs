using FSC.Domain.Models.Master;
using MediatR;

namespace FSC.Application.Commands.AircraftTypes
{
    public record DeleteAircraftType(long id) : IRequest<OperationResult<AircraftType>>;
    internal class DeleteAircraftTypeHandler(IRepositoryBase<AircraftType> aircraftTypeRepo)
        : IRequestHandler<DeleteAircraftType, OperationResult<AircraftType>>
    {
        public async Task<OperationResult<AircraftType>> Handle(DeleteAircraftType request, CancellationToken cancellationToken)
        {
            var result = new OperationResult<AircraftType>();
            var aircraftType = await aircraftTypeRepo.FirstOrDefaultAsync(x => x.Id == request.id);
            
            if (aircraftType == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }
            
            if (aircraftType.IsReadOnly == true)
            {
                result.AddError(ErrorCode.ServerError, "Record cannot be deleted.");
                return result;
            }
            
            aircraftType.Delete();
            await aircraftTypeRepo.UpdateAsync(aircraftType);

            result.Payload = aircraftType;
            result.Message = "Operation success";
            return result;
        }
    }
}

