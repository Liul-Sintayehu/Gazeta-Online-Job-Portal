using FSC.Domain.Models.Master;

namespace FSC.Application.Commands.Master.AircraftTypes
{
    public record UpdateAircraftType(long Id, string AircraftTypeCode, string AircraftTypeName) : IRequest<OperationResult<AircraftType>>;
    internal class UpdateAircraftTypeHandler(IRepositoryBase<AircraftType> aircraftTypeRepo)
        : IRequestHandler<UpdateAircraftType, OperationResult<AircraftType>>
    {
        public async Task<OperationResult<AircraftType>> Handle(UpdateAircraftType req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<AircraftType>();
            var aircraftType = await aircraftTypeRepo.FirstOrDefaultAsync(fs => fs.Id == req.Id && fs.RecordStatus != RecordStatus.Deleted);
            
            if (aircraftType is null)
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "No record to update.");
                return result;
            }
            
            if (await aircraftTypeRepo.ExistWhereAsync(x => x.AircraftTypeCode == req.AircraftTypeCode && x.RecordStatus != RecordStatus.Deleted && x.Id != req.Id))
            {
                result.AddError(ErrorCode.RecordAlreadyExists, "Name already exists.");
                return result;
            }

            try
            {
                aircraftType.Update(req.AircraftTypeCode, req.AircraftTypeName);    
                await aircraftTypeRepo.UpdateAsync(aircraftType);
                result.Payload = aircraftType;
                result.Message = "Operation success";
            }
            catch (NotValidException ex)    
            {
                foreach (var validationError in ex.ValidationErrors)
                {
                    result.AddError(ErrorCode.ValidationError, validationError);   
                };  
            }
            
            return result;
        }
    }
}

