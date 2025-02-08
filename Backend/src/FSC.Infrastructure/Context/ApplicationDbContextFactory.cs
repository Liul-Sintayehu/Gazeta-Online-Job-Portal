using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FSC.Infrastructure.Context;

public class ApplicationDbContextFactory: IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        
        // TODO: Delete this literal connection string, or you'll get burned by security
        var connectionString = "Server=10.0.226.34;Database=FSC;user id=CargoAccountingUser;password=Abcd@1234;MultipleActiveResultSets=true;TrustServerCertificate=true";

        optionsBuilder.UseSqlServer(connectionString);
            
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}