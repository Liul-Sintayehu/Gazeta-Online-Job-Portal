

namespace FSC.API.Options
{
    public class ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider) : IConfigureOptions<SwaggerGenOptions>
    {
        public void Configure(SwaggerGenOptions options)
        {
            foreach (var description in provider.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, CreateVersionInfo(description));

            }
        }
        private static OpenApiInfo CreateVersionInfo(ApiVersionDescription description)
        {
            var info = new OpenApiInfo
            {
                Title = "SeMS-API",
                Version = description.ApiVersion.ToString()

            };
            if (description.IsDeprecated)
                info.Description = "This API version has been deprecated";
            return info;
        }
    }
}
