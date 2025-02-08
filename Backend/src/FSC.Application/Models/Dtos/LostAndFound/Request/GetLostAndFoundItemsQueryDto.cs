namespace FSC.Application.Models.Dtos.LostAndFound.Request;

public class GetLostAndFoundItemsQueryDto
{
    public DateTime StartFoundDate { get; set; }
    public DateTime? EndFoundDate { get; set; }
    
    public string? FlightNumber { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? ItemName { get; set; } = string.Empty;
    public string? Category { get; set; } = string.Empty;
    public string? AgentName { get; set; }
    public string? ReceiptNumber { get; set; }

    public bool? IsConfirmed { get; set; }

    public int? PageSize { get; set; }
    public int? PageNumber { get; set; }

    public RecordStatus? RecordStatus { get; set; }
}