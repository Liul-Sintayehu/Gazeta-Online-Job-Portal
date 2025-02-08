using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.AircraftTypes
{
    public record UpdateStatusAircraftType(long Id, RecordStatus RecordStatus) : IRequest<OperationResult<AircraftType>>;
    internal class UpdateStatusAircraftTypeHandler(IRepositoryBase<AircraftType> aircraftTypeRepo)
        : IRequestHandler<UpdateStatusAircraftType, OperationResult<AircraftType>>
    {
        public async Task<OperationResult<AircraftType>> Handle(UpdateStatusAircraftType req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<AircraftType>();
            var aircraftType = await aircraftTypeRepo.FirstOrDefaultAsync(x => x.Id == req.Id);
            
            if (aircraftType is null)
            {
                result.AddError(ErrorCode.NotFound, "No record found,");
                return result;
            }
            
            aircraftType.UpdateRecordStatus(req.RecordStatus);
            await aircraftTypeRepo.UpdateAsync(aircraftType);
            
            result.Payload = aircraftType;
            result.Message = "Operation success";
            return result;
        }
    }
}

