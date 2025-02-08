namespace FSC.Domain.Models;

public class AuditEventLog
{
    public long Id { get; set; }
    public string UserName { get; private set; } = string.Empty;
    public string IpAddress { get; private set; } = string.Empty;
    public string Url { get; private set; } = string.Empty;
    public string Payload { get; private set; } = string.Empty;
    public string StatusCode { get; private set; } = string.Empty;
    public DateTime DateTime { get; private set; }

    public static AuditEventLog Add( string ipAddress, string url, string payload, string statusCode,string userName = " ")
    {
        var auditLog = new AuditEventLog
        {
            UserName = _setEmptyString(userName),
            IpAddress = _setEmptyString( ipAddress),
            Url = _setEmptyString(url),
            Payload = _setEmptyString(payload),
            StatusCode = _setEmptyString(statusCode),
            DateTime = DateTime.UtcNow
        };
        return auditLog;
    }

    private static string _setEmptyString(string value) => string.IsNullOrEmpty(value) ? string.Empty : value;

}

