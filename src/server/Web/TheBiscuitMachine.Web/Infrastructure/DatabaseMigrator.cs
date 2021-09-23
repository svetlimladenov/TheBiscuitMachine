using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Infrastructure;

namespace TheBiscuitMachine.Web.Infrastructure
{
    public static class DatabaseMigrator
    {
        public static void MigrateDatabase(this IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetRequiredService<TheBiscuitMachineContext>();
                dbContext.Database.Migrate();
            }
        }
    }
}
