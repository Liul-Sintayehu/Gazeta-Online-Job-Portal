using FSC.Infrastructure.Configurations;

namespace FSC.API.Registrars
{
    public class DbRegistrar : IWebApplicationBuilderRegistrar
    {
        public void RegisterServices(WebApplicationBuilder builder)
        {
            var connectionString = Environment.GetEnvironmentVariable("MSSQLDB_HOST");
            if (string.IsNullOrEmpty(connectionString))
                connectionString = builder.Configuration.GetConnectionString("Default");

            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
            builder.Services.AddTransient<ITenant, TenantService>();
        }
    }
}
