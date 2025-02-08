namespace FSC.Application.Models.Dtos.LostAndFound.Request;

public class LostAndFoundItemDto
{
    public string ItemName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string FoundLocation { get; set; } = string.Empty;
    public DateTime DateTimeFound { get; set; }
    public int Amount { get; set; }
    public string? Price { get; set; }
    
    public string? Shift { get; set; }
    public string? AgentId { get; set; }
    public string? AgentName { get; set; }
    public string? ReceiptNumber { get; set; }
    
    public string? SecurityOfficerName { get; set; }
    public string? SecurityOfficerId { get; set; }
    
    public string? FlightNumber { get; set; }
    public DateTime? FlightDate { get; set; }
    public string? AircraftType { get; set; }
    public bool? IsReturned { get; set; }
}