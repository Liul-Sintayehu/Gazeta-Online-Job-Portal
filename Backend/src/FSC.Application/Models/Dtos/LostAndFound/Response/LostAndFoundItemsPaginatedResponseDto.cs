namespace FSC.Application.Models.Dtos.LostAndFound.Response;

public class LostAndFoundItemsPaginatedResponseDto
{
    public List<LostAndFoundItemDetailDto> LostAndFoundItems { get; set; } = [];
    public int TotalCount { get; set; }
}