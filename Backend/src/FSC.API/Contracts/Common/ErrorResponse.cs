namespace FSC.Api.Contracts.Common;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string StatusPhrase { get; set; } = string.Empty;
    public List<string> Errors { get; } = [];
    public DateTime Timestamp { get; set; }
}