using FSC.Domain.Validator.Attachments;

namespace FSC.Domain.Models.Attachments;

public class Attachment: BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? Caption { get; set; }
    
    public FileType FileType { get; set; }
    public long FileSize { get; set; }
    
    public long RelatedEntityId { get; set; }
    public EntityType RelatedEntityType { get; set; }

    public static Attachment Create(
        string path,
        string name,
        string? caption,
        string? fileType,
        long fileSize,
        long relatedEntityId,
        EntityType relatedEntityType
        )
    {
        var attachment = new Attachment()
        {
            Name = name,
            Path = path,
            Caption = caption,
            FileType = MapFileType(fileType),
            FileSize = fileSize,
            RelatedEntityId = relatedEntityId,
            RelatedEntityType = relatedEntityType
        };

        var validator = new AttachmentValidator();
        var response = validator.Validate(attachment);
        if (response.IsValid)
        {
            attachment.Register();
            return attachment;
        }

        var error = new NotValidException();
        response.Errors.ForEach(failure => error.ValidationErrors.Add(failure.ErrorMessage));
        throw error;
    }
    
    public void Update(
        string name,
        string path,
        string? caption,
        FileType fileType,
        long fileSize,
        long relatedEntityId,
        EntityType relatedEntityType
    )
    {
        Name = name;
        Path = path;
        Caption = caption;
        FileType = fileType;
        FileSize = fileSize;
        RelatedEntityId = relatedEntityId;
        RelatedEntityType = relatedEntityType;

        var validator = new AttachmentValidator();
        var response = validator.Validate(this);
        if (response.IsValid)
        {
            UpdateAudit();
            return;
        }

        var error = new NotValidException();
        response.Errors.ForEach(failure => error.ValidationErrors.Add(failure.ErrorMessage));
        throw error;
    }
    
    private static FileType MapFileType(string? fileType)
    {
        return fileType switch
        {
            "image/jpeg" => FileType.Image,
            "image/png" => FileType.Image,
            "image/jpg" => FileType.Image,
            "image/gif" => FileType.Image,
            "image/svg+xml" => FileType.Image,
            "image/webp" => FileType.Image,
            "application/pdf" => FileType.Pdf,
            _ => FileType.Other
        };
    }
}
