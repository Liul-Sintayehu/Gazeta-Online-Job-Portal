namespace FSC.Application.Models
{
    public class ValidateAllRequest
    {
        public string AccessToken { get; set; } = string.Empty;
        public string IdToken { get; set; } = string.Empty;
        public string ApiResource { get; set; } = string.Empty;
        public string ClientResource { get; set; } = string.Empty;
        public long ServiceId { get; set; }
        public string OrganizationCode { get; set; } = string.Empty;
        public bool IsMultiTenant { get; set; }
    }
    public class UserTokenValidationResponse: Exception
    {
        public string ClientId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Tenant { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public string Storage { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
    public class ValidateTokenRequest
    {
        public string AccessToken { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
