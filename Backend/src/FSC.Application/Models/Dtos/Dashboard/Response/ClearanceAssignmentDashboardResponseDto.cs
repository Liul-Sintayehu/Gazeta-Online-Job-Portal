namespace FSC.Application.Models.Dtos.Dashboard.Response;

public class ClearanceAssignmentDashboardResponseDto
{
    public double AverageMinutes { get; set; }
    public int ApprovedCount { get; set; }
    public int AssignedCount { get; set; }
    public int UnassignedCount { get; set; }
}