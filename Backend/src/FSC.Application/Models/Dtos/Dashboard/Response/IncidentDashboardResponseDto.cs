namespace FSC.Application.Models.Dtos.Dashboard.Response;

public class IncidentDashboardResponseDto
{
    public string Incident { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Investigation { get; set; }
}
