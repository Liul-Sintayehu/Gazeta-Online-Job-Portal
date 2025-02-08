namespace FSC.Application.Models
{
    public class Settings
    {
        public AzureStorageConfig azureStorageConfig { get; set; }
    }
    public class AzureStorageConfig
    {
        public string? AccountName { get; set; }
        public string? ImageContainer { get; set; }
        public string? AccountKey { get; set; }
    }

}
