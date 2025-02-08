using FSC.Application.Models.Dtos.Dashboard.Response;
using FSC.Domain.Models.EmployeeAssignments;
using FSC.Domain.Models.Master;

namespace FSC.Application.Queries.Dashboard;

public record MasterDataDashboardQuery : IRequest<OperationResult<MasterDataDashboardResponseDto>>;

internal class MasterDataDashboardQueryHandler(
    IRepositoryBase<Employee> employeeRepo,
    IRepositoryBase<SubTask> subTaskRepo,
    IRepositoryBase<Post> postRepo
) : IRequestHandler<MasterDataDashboardQuery, OperationResult<MasterDataDashboardResponseDto>>
{
    public async Task<OperationResult<MasterDataDashboardResponseDto>> Handle(MasterDataDashboardQuery request,
        CancellationToken cancellationToken)
    {
        var result = new OperationResult<MasterDataDashboardResponseDto>();

        try
        {
            var employeeCount = await employeeRepo.Where(e => e.RecordStatus == RecordStatus.Active)
                .CountAsync(cancellationToken);
            var subTaskCount = await subTaskRepo.Where(e => e.RecordStatus == RecordStatus.Active)
                .CountAsync(cancellationToken);
            var locationCount = await postRepo.Where(e =>
                    e.ParentPostId == null
                    && e.RecordStatus == RecordStatus.Active)
                .CountAsync(cancellationToken);
            var postCount = await postRepo.Where(e =>
                    e.ParentPostId != null
                    && e.RecordStatus == RecordStatus.Active)
                .CountAsync(cancellationToken);


            result.Payload = new MasterDataDashboardResponseDto()
            {
                EmployeeCount = employeeCount,
                ClearanceTaskCount = subTaskCount,
                LocationCount = locationCount,
                PostCount = postCount
            };
        }
        catch (Exception e)
        {
            result.AddError(ErrorCode.ServerError, e.Message);
        }

        return result;
    }
}