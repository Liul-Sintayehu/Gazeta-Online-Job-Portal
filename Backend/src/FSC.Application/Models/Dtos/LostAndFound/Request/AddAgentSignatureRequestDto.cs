using Microsoft.AspNetCore.Http;

namespace FSC.Application.Models.Dtos.LostAndFound.Request;

public class AddAgentSignatureRequestDto
{
   public IFormFile Signature { get; set; }
}