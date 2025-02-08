using FSC.Infrastructure.Configurations;

namespace FSC.API.Registrars;

public class MvcRegistrar : IWebApplicationBuilderRegistrar
{
    public void RegisterServices(WebApplicationBuilder builder)
    {
        builder.Services.AddMvc(options =>
        {
            //options.Filters.Add(typeof(AuthorizationHandler));
            options.Filters.Add(typeof(UserActivityFilter));
            options.EnableEndpointRouting = false;
        });
        builder.Services.AddControllers(config => { config.Filters.Add(typeof(ExceptionHandler)); })
            .AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
        builder.Services.Configure<Settings>(builder.Configuration.GetSection("Settings"));
        builder.Services.Configure<ServicesUrl>(builder.Configuration.GetSection("ServicesUrl"));
        builder.Services.AddApiVersioning(config =>
        {
            config.DefaultApiVersion = new ApiVersion(1, 0);
            config.AssumeDefaultVersionWhenUnspecified = true;
            config.ReportApiVersions = true; // response header tells preferable 
            config.ApiVersionReader = new UrlSegmentApiVersionReader(); // read version from url
        });
        builder.Services.AddVersionedApiExplorer(config =>
        {
            config.GroupNameFormat = "'v'VVV";
            config.SubstituteApiVersionInUrl = true;
        });

        // Service Urls for Identity Service
        builder.Services.Configure<ServicesUrl>(builder.Configuration.GetSection("ServicesUrl"));

        const string myAllowSpecificOrigins = "_myAllowSpecificOrigins";
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(myAllowSpecificOrigins,
                policy =>
                {
                    //policy.WithOrigins("localhost:3000")
                    policy.WithOrigins(allowedOrigins)
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    //.AllowAnyOrigin();
                });
        });

        // Add session services
        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSession(ops =>
        {
            ops.IdleTimeout = TimeSpan.FromMinutes(30);
            ops.Cookie.HttpOnly = true;
            ops.Cookie.IsEssential = true;
        });

        builder.Services.AddHttpContextAccessor();
        builder.Services.BuildServiceProvider();
        builder.Services.AddEndpointsApiExplorer();
    }
}
