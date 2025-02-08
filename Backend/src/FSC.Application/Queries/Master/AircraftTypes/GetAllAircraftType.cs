using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Master.AircraftTypes
{
    public record GetAllAircraftType(RecordStatus? RecordStatus) : IRequest<OperationResult<List<AircraftType>>>;
    internal class GetAllAircraftTypeHandler(IRepositoryBase<AircraftType> aircraftTypeRepo)
        : IRequestHandler<GetAllAircraftType, OperationResult<List<AircraftType>>>
    {
        public async Task<OperationResult<List<AircraftType>>> Handle(GetAllAircraftType req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<List<AircraftType>>();

            var aircraftTypes = await aircraftTypeRepo.Where(x =>
                                    x.RecordStatus != RecordStatus.Deleted &&
                                    (
                                        req.RecordStatus == null ||
                                        req.RecordStatus == x.RecordStatus)
                                    ).ToListAsync(cancellationToken);

            result.Payload = aircraftTypes;
            result.Message = "Operation success";
            return result;
        }
    }
}


