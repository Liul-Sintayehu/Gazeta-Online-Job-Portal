namespace FSC.API.Registrars;
public class ApplicationInsightsRegistrar : IWebApplicationBuilderRegistrar
{
    public void RegisterServices(WebApplicationBuilder builder) => builder.Services.AddApplicationInsightsTelemetry(Environment.GetEnvironmentVariable("APPINSIGHTS_CONNECTIONSTRING"));
}
