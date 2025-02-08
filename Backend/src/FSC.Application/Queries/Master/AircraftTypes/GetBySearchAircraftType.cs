using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Master.AircraftTypes
{
    public record GetBySearchAircraftType(string? aircraftTypeCode, string? aircraftTypeName) : IRequest<OperationResult<List<AircraftType>>>;

    internal class GetBySearchAircraftTypeHandler : IRequestHandler<GetBySearchAircraftType, OperationResult<List<AircraftType>>>
    {
        private readonly IRepositoryBase<AircraftType> _aircraftType;
        public GetBySearchAircraftTypeHandler(IRepositoryBase<AircraftType> _aircraftType) => this._aircraftType = _aircraftType;
        public async Task<OperationResult<List<AircraftType>>> Handle(GetBySearchAircraftType req, CancellationToken cancellationToken)
        {
            var result = new OperationResult<List<AircraftType>>();
            var aircraftTypes = from r in _aircraftType.Query() select r;
            if (!string.IsNullOrEmpty(req.aircraftTypeCode))
                aircraftTypes = aircraftTypes.Where(_ => _.AircraftTypeCode.Contains(req.aircraftTypeCode));
            if (!string.IsNullOrEmpty(req.aircraftTypeName))
                aircraftTypes = aircraftTypes.Where(_ => _.AircraftTypeName.Contains(req.aircraftTypeName));

            result.Payload = await aircraftTypes.Where(_ => _.RecordStatus != RecordStatus.Deleted).ToListAsync();
            result.Message = "Operation success";
            return result;
        }
    }

}

