namespace FSC.Application.Models.Dtos.Dashboard.Response;

public class LostAndFoundDashboardResponseDto
{
    public DateTime Date { get; set; }
    public int Items { get; set; }
    public string Price { get; set; } = string.Empty;
    public string? Shift { get; set; } = string.Empty;
    public bool IsConfirmed { get; set; }
}