
using FSC.Infrastructure.HTTP.Models;

namespace FSC.Infrastructure.HTTP
{
    public interface IHttpService : IDisposable
    {
        Response ResponseModel { get; set; }
        Task<T> SendAsync<T>(ApiRequest apiRequest);
    }
}

