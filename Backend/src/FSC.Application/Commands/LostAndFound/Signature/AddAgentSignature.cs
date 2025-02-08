using FSC.Application.Models.Dtos.LostAndFound.Request;
using FSC.Application.Services.Helper;
using FSC.Domain.Models.LostAndFound;

namespace FSC.Application.Commands.LostAndFound.Signature;

public record AddAgentSignature(long Id, AddAgentSignatureRequestDto Dto): IRequest<OperationResult<bool>>;

internal class AddAgentSignatureHandler(
    IRepositoryBase<LostAndFoundItem> lostAndFoundRepo,
    IFileStorageService fileStorageService
    ): IRequestHandler<AddAgentSignature, OperationResult<bool>>
{
    public async Task<OperationResult<bool>> Handle(AddAgentSignature request, CancellationToken cancellationToken)
    {
        var result = new OperationResult<bool>();
        var lostAndFoundItem = await lostAndFoundRepo.Where(inv => 
                inv.Id == request.Id
                && inv.RecordStatus != RecordStatus.Deleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (lostAndFoundItem == null)
        {
            result.AddError(ErrorCode.NotFound, $"Lost and Found item not found!");
            return result;
        }

        var signatureFilePath = await fileStorageService.UploadFileAsync(request.Dto.Signature, GetSignatureSubFolder());
        
        lostAndFoundItem.SignAgent(signatureFilePath);
        
        result.Payload = await lostAndFoundRepo.UpdateAsync(lostAndFoundItem);
        return result;
    }

    private static string GetSignatureSubFolder() => "Attachments/LostAndFound/Signatures";
}