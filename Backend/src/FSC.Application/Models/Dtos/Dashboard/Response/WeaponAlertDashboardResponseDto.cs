namespace FSC.Application.Models.Dtos.Dashboard.Response;

public class WeaponAlertDashboardResponseDto
{
    public int OnTime { get; set; }
    public int Late { get; set; }
    public int NotAssigned { get; set; }
    public int TotalWeapons { get; set; }
}