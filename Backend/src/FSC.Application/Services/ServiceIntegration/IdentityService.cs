using FSC.Infrastructure.Configurations;
using FSC.Infrastructure.HTTP;
using FSC.Infrastructure.HTTP.Models;
using Microsoft.Extensions.Options;

namespace FSC.Application.Services.ServiceIntegration
{
    public interface IIdentityService
    {
        Task<object> GenerateEmailToken(string email, string fullName, int tokenLifetime, string token);
        Task<object> ValidateEmailToken(string accessToken, string fullName, string email, string systemToken);

        OperationResult<UserTokenValidationResponse> ValidateAllToken(string accessToken, string idToken,
            string apiResource, string clientResource, long serviceId, string organizationCode);

        Task<object> ValidateClientToken(string accessToken, string apiResource, long serviceId);
        Task<IdentityCreateResDto> CreateUser(IdentityCreateUserDto request, string accessToken);
        Task<object> AddUserSubscription(IdentitySubscriptionDto request, string accessToken);
        Task<T> PostClaimsAsync<T>(ClaimRequest claims);
    }

    public class IdentityService(IOptions<ServicesUrl> servicesUrl, IHttpService httpService)
        : IIdentityService
    {
        public async Task<object> GenerateEmailToken(string email, string fullName, int tokenLifetime,
            string systemToken)
        {
            return await httpService.SendAsync<string>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                AccessToken = systemToken
            });
        }

        public OperationResult<UserTokenValidationResponse> ValidateAllToken(string accessToken, string idToken,
            string apiResource, string clientResource, long serviceId, string organizationCode)
        {
            return httpService.SendAsync<OperationResult<UserTokenValidationResponse>>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                Url = $"{BaseUrl.Identity()}" +
                      $"{servicesUrl.Value.IdentityService.ValidateAll}",
                Data = new ValidateAllRequest()
                {
                    AccessToken = accessToken,
                    IdToken = idToken,
                    ApiResource = apiResource,
                    ClientResource = clientResource,
                    ServiceId = serviceId,
                    IsMultiTenant = false,
                    OrganizationCode = organizationCode
                },
                AccessToken = accessToken,
            }).Result;
        }

        public async Task<object> ValidateClientToken(string accessToken, string apiResource, long serviceId)
        {
            return await httpService.SendAsync<OperationResult<UserTokenValidationResponse>>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                //Url = $"{BaseUrl.IdentityBaseUrl()}" +
                //$"{_servicesUrl.Value.IdentityService.ValidateAll}?" +
                //$"accesstoken={accessToken}&" +
                //$"apiResource={apiResource}&" +
                //$"serviceId={serviceId}",
                AccessToken = accessToken,
            });
        }

        public async Task<object> ValidateEmailToken(string accessToken, string fullName, string email,
            string systemToken)
        {
            return await httpService.SendAsync<string>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                //Url = $"{BaseUrl.IdentityBaseUrl()}" +
                //$"{_servicesUrl.Value.IdentityService.ValidateEmailToken}",
                Data = new ValidateTokenRequest { AccessToken = accessToken, FullName = fullName, Email = email },
                AccessToken = systemToken
            });
        }

        public Task<IdentityCreateResDto> CreateUser(IdentityCreateUserDto request, string accessToken)
        {
            return Task.FromResult(httpService.SendAsync<IdentityCreateResDto>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                Url = $"{BaseUrl.Identity()}" +
                      $"{servicesUrl.Value.IdentityService.CreateUser}",
                Data = request,
                AccessToken = accessToken,
            }).Result);
        }

        public Task<object> AddUserSubscription(IdentitySubscriptionDto request, string accessToken)
        {
            return Task.FromResult<object>(httpService.SendAsync<OperationResult<UserTokenValidationResponse>>(new ApiRequest()
            {
                ApiType = ApiType.POST,
                Url = $"{BaseUrl.Identity()}" +
                      $"{servicesUrl.Value.IdentityService.AddSubscription}",
                Data = request,
                AccessToken = accessToken,
            }).Result);
        }
        
        public async Task<T> PostClaimsAsync<T>(ClaimRequest claims)
        {
            return await httpService.SendAsync<T>(new ApiRequest()
            {
                ApiType = ApiType.POST,
 
                Url = $"{BaseUrl.Identity()}" +
                      $"{servicesUrl.Value.IdentityService.CreateClaims}",
                AccessToken = "/empty",
                Data = claims
            });
        }
    }
    
    public class ClaimRequest
    {
        public int ServiceId { get; set; }
        public List<string> Claim { get; set; } = [];
        public bool RequiredIdToken { get; set; }
 
    }
}