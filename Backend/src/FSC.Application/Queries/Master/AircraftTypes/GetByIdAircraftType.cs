using FSC.Domain.Models.Master;
using MediatR;

namespace FSC.Application.Queries.Master.AircraftTypes
{
    public record GetByIdAircraftType(long Id) : IRequest<OperationResult<AircraftType>>;

    internal class GetByIdAircraftTypeHandler : IRequestHandler<GetByIdAircraftType, OperationResult<AircraftType>>
    {
        private readonly IRepositoryBase<AircraftType> _aircraftType;
        public GetByIdAircraftTypeHandler(IRepositoryBase<AircraftType> _aircraftType) => this._aircraftType = _aircraftType;
        public async Task<OperationResult<AircraftType>> Handle(GetByIdAircraftType req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<AircraftType>();
            var aircraftTpe = _aircraftType.FirstOrDefault(x => x.Id == req.Id && x.RecordStatus != RecordStatus.Deleted);
            if (aircraftTpe == null)
            {
                result.AddError(ErrorCode.NotFound, "Record doesn't exist.");
                return result;
            }
            result.Payload = aircraftTpe;
            result.Message = "Operation success";
            return result;
        }
    }

}