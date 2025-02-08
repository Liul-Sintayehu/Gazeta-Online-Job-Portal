namespace FSC.Application.Models.Dtos.Common;

public class BaseEntityDto
{
    public long Id { get; set; }
        
    public DateTime RegisteredDate { get; private set; }
    public DateTime LastUpdateDate { get; private set; }
    
    public string RegisteredBy { get; private set; } = string.Empty;
    public string UpdatedBy { get; private set; } = string.Empty;
}