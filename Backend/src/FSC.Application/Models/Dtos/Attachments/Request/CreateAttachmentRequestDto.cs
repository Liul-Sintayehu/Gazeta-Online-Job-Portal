using Microsoft.AspNetCore.Http;

namespace FSC.Application.Models.Dtos.Attachments.Request;

public class CreateAttachmentRequestDto
{
    public long RelatedEntityId { get; set; }
    public EntityType RelatedEntityType { get; set; }
    public IFormFile File { get; set; }
    public string? Caption { get; set; }
}