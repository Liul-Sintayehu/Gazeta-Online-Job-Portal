namespace FSC.Infrastructure.Configurations
{
    public static  class BaseUrl
    {
        //public static  string Identity() => Environment.GetEnvironmentVariable("Identity_URL")?? "https://api-dev-iam.ethiopianairlines.com/iam-service/";
        public static  string Identity() => Environment.GetEnvironmentVariable("Identity_URL")?? "https://api-iam.ethiopianairlines.com/iam-service/";
    }

    public  class ServicesUrl
    {
        public  IdentityService IdentityService { get; set; } = new();
    }
    public class IdentityService
    {
        public string ValidateAll { get; set; } = string.Empty;
        public string CreateUser { get; set; } = string.Empty;
        public string CreateClaims { get; set; } = string.Empty;
        public string AddSubscription { get; set; } = string.Empty;
        public string GenerateEmailToken { get; set; } = string.Empty;
        public string ValidateEmailToken { get; set; } = string.Empty;
        public string ValidateClient { get; set; } = string.Empty;
    }
}
