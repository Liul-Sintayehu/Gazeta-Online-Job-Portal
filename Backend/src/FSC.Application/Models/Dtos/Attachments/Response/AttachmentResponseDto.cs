namespace FSC.Application.Models.Dtos.Attachments.Response;

public class AttachmentResponseDto
{
    public long Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? Caption { get; set; }
    
    public FileType FileType { get; set; }
    public long FileSize { get; set; }
    
    public long RelatedEntityId { get; set; }
    public EntityType RelatedEntityType { get; set; }
    
    public DateTime RegisteredDate { get; set; }
    public DateTime LastUpdateDate { get; set; }
}