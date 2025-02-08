using System.Globalization;

namespace FSC.API.Registrars;
public class LocalizationRegistrar : IWebApplicationBuilderRegistrar, IWebApplicationRegistrar
{
    private readonly RequestLocalizationOptions localizationOptions = new RequestLocalizationOptions()
    {
        SupportedCultures = new[] {
            new CultureInfo("en-US"),
            new CultureInfo("am"),
        },
        SupportedUICultures = new[]
        {
             new CultureInfo("en-US"),
            new CultureInfo("am"),
        },
    };
    public void RegisterServices(WebApplicationBuilder builder)
    {
        builder.Services.AddLocalization();
        localizationOptions.SetDefaultCulture("en-US");
        localizationOptions.ApplyCurrentCultureToResponseHeaders = true;
    }
    public void RegisterPipelineComponents(WebApplication app)
    {
        app.UseRequestLocalization(localizationOptions);
    }
}
