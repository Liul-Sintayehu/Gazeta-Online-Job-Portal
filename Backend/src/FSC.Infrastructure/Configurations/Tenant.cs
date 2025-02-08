using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Text;
namespace FSC.Infrastructure.Configurations;

public interface ITenant
{
    string GetDbConnectionString();
    Uri GetStorageURI();
    string GetStorageKey();
    Dictionary<string, string> GetEmailKeys();
}
public class TenantService : ITenant
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;
    public TenantService(IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
    }
    private ISession _session => _httpContextAccessor?.HttpContext?.Session;

    public Uri GetStorageURI()
    {
        var storageVariable = _session?.GetString("storage");
        if (!string.IsNullOrEmpty(storageVariable))
        {
            var blobConnectionString = Environment.GetEnvironmentVariable(storageVariable);
            string[] conectionString = blobConnectionString.Split(new string[] { "~~~" }, StringSplitOptions.None);

            string url = $"https://{conectionString[0]}.blob.core.windows.net/{conectionString[1]}/";
            return new Uri(url);
        }
        return new Uri(string.Empty);
    }
    public string GetStorageKey()
    {
        var storageVariable = _session?.GetString("storage");
        if (!string.IsNullOrEmpty(storageVariable))
        {
            var blobConnectionString = Environment.GetEnvironmentVariable(storageVariable);
            string[] conectionString = blobConnectionString.Split(new string[] { "~~~" }, StringSplitOptions.None);
            return conectionString[2];
        }
        return string.Empty;
    }

    public Dictionary<string, string> GetEmailKeys()
    {
        var emailSettings = _session?.GetString("email");
        if (string.IsNullOrEmpty(emailSettings))
            return new Dictionary<string, string>();

        var emailStrings = Environment.GetEnvironmentVariable(emailSettings) ?? _configuration[$"Email:ET"];
        string[] parts = emailStrings.Split(new string[] { "~~~" }, StringSplitOptions.None);

        if (parts.Length != 4)
            return new Dictionary<string, string>();

        return new Dictionary<string, string>
    {
        { "SmtpHost", parts[0] },
        { "SmtpPort", parts[1] },
        { "FromEmail", parts[2] },
        { "SmtpPassword", parts[3] }
    };
    }

    public string GetDbConnectionString()
    {
        var database = _session?.GetString("database");
        if (!string.IsNullOrEmpty(database))
            return Environment.GetEnvironmentVariable(database) ?? string.Empty;
        return string.Empty;
    }


}
