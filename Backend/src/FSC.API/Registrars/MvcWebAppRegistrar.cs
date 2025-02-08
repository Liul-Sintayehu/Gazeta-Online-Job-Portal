using Microsoft.Extensions.FileProviders;

namespace FSC.API.Registrars
{
    public class MvcWebAppRegistrar : IWebApplicationRegistrar
    {
        public void RegisterPipelineComponents(WebApplication app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();
                foreach (var description in provider.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint($"{description.GroupName}/swagger.json", description.ApiVersion.ToString());
                }
            });

            // CORS (must be registered before routing)
            const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";
            app.UseCors(myAllowSpecificOrigins);

            // Security and caching headers
            app.Use(async (context, next) =>
            {
                // Disable caching
                context.Response.Headers.Add("Cache-Control", "no-store");
                context.Response.Headers.Add("Pragma", "no-cache");

                // Remove unnecessary headers
                context.Response.Headers.Remove("Server");
                context.Response.Headers.Remove("X-Powered-By");

                // Add security headers
                context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");

                // Add API version header
                context.Response.Headers["api-supported-versions"] = "1.0";

                await next();
            });

            // Cookie Policy
            app.UseCookiePolicy(new CookiePolicyOptions
            {
                Secure = CookieSecurePolicy.Always
            });

            // Enable session middleware
            app.UseSession();

            // Static files
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Uploads")),
                RequestPath = "/Uploads"
            });

            // Enable routing
            app.UseRouting();

            // HTTPS Redirection
            app.UseHttpsRedirection();

            // Authorization
            app.UseAuthorization();

            // Controllers
            app.MapControllers();

            // Root endpoint
            app.MapGet("/", () => "FSC Service - API");
        }
    }
}
