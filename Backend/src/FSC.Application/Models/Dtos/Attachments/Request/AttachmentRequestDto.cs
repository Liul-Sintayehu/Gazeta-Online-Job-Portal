using Microsoft.AspNetCore.Http;

namespace FSC.Application.Models.Dtos.Attachments.Request;

public class AttachmentRequestDto
{
    public IFormFile File { get; set; }
    public string? Caption { get; set; }
}