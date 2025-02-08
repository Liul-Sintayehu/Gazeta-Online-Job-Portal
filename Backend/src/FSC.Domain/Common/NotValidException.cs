namespace FSC.Domain.Common;
public class NotValidException : Exception
{
    public NotValidException()
    {
        ValidationErrors = new List<string>();
    }

    public NotValidException(string message) : base(message)
    {
        ValidationErrors = new List<string>();
    }

    public NotValidException(string message, Exception inner) : base(message, inner)
    {
        ValidationErrors = new List<string>();
    }
    public List<string> ValidationErrors { get; }
}
