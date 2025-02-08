using System.Net.Http.Headers;
using System.Text;
using FSC.Infrastructure.HTTP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using static System.GC;

namespace FSC.Infrastructure.HTTP;

public class HttpService(
    IHttpClientFactory httpClient,
    ILogger<HttpService> logger,
    IHttpContextAccessor httpContextAccessor)
    : IHttpService
{
    public Response ResponseModel { get; set; } = new();
    private ISession? Session => httpContextAccessor.HttpContext?.Session;

    public void Dispose()
    {
        SuppressFinalize(true);
    }

    public async Task<T> SendAsync<T>(ApiRequest apiRequest)
    {
        try
        {
            var client = httpClient.CreateClient("FSCServiceAPI");
            client.DefaultRequestHeaders.Clear();
            var message = new HttpRequestMessage();
            message.Headers.Add("Accept", "application/json");
            message.Headers.Add("Servicekey",
                $"{Environment.GetEnvironmentVariable("SERVICE_KEY") ?? "86rIsmabiYR0OuW1B6NHovQsmWB8"}");
            message.RequestUri = new Uri(apiRequest.Url);
            message.Method = _getMethodType(apiRequest.ApiType);
            message.Content = new StringContent(JsonConvert.SerializeObject(apiRequest.Data), Encoding.UTF8,
                "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiRequest.AccessToken);

            var response = await client.SendAsync(message);
            var content = await response.Content.ReadAsStringAsync();
            logger.LogCritical($"alazar identity return is  - {content} ");
            return JsonConvert.DeserializeObject<T>(content);
        }
        catch (Exception ex)
        {
            logger.LogCritical($"alazar - ex-message {ex.Message}  ");
            logger.LogCritical($"alazar - ex-inner message {ex.InnerException?.Message}  ");
            return (T)(object)new Response
            {
                DisplayMessage = "Error",
                ErrorMessages = [Convert.ToString(ex.Message)],
                IsSuccess = false
            };
        }
    }

    private static HttpMethod _getMethodType(ApiType apiType)
    {
        return apiType switch
        {
            ApiType.GET => HttpMethod.Get,
            ApiType.POST => HttpMethod.Post,
            ApiType.PUT => HttpMethod.Put,
            ApiType.DELETE => HttpMethod.Delete,
            _ => throw new ArgumentException("Invalid enum value", nameof(apiType))
        };
    }
}