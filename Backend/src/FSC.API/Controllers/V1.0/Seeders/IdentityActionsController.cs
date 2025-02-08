using System.Reflection;
using FSC.API.Controllers.Common;
using Microsoft.AspNetCore.Authorization;

namespace FSC.API.Controllers.V1._0.Seeders;

public class IdentityActionsController(IIdentityService identityService) : BaseController
{
    [AllowAnonymous]
    [HttpPost("ApiClaimSeeder")]
    public async Task<IActionResult> ApiClaimSeeder()
    {
        const int serviceId = 29;
        var asm = Assembly.GetExecutingAssembly();

        var controllerActions = asm.GetTypes()
            .Where(type => typeof(ControllerBase).IsAssignableFrom(type))
            .SelectMany(
                type => type.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public))
            .Where(m => m.GetCustomAttributes(typeof(System.Runtime.CompilerServices.CompilerGeneratedAttribute), true)
                .Length == 0)
            .Select(x => new
            {
                Controller = x.DeclaringType?.Name,
                Action = x.Name,
                ReturnType = x.ReturnType.Name,
                Attributes = string.Join(",",
                    x.GetCustomAttributes().Select(a => a.GetType().Name.Replace("Attribute", "")))
            })
            .OrderBy(x => x.Controller).ThenBy(x => x.Action).ToList();

        var claimRequest = new ClaimRequest()
            { RequiredIdToken = true, ServiceId = serviceId, Claim = [] };

        foreach (var controllerAction in controllerActions)
            claimRequest.Claim.Add(controllerAction.Controller?.Replace("Controller", "") + "-" +
                                   controllerAction.Action);

        var result = await identityService.PostClaimsAsync<ClaimRequest>(claimRequest);

        return Ok(result);
    }
}