using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Sagas;
using TheBiscuitMachine.Data.Common;

namespace TheBiscuitMachine.Infrastructure
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<TheBiscuitMachineContext>(options =>
                 options.UseSqlServer(
                     configuration.GetConnectionString("DefaultConnection"),
                     b => b.MigrationsAssembly(typeof(TheBiscuitMachineContext).Assembly.FullName)));

            services.AddScoped<IDbContext>(provider => provider.GetService<TheBiscuitMachineContext>());

            services.AddSingleton<IBiscuitMachineConfigurator, BiscuitMachineConfigurator>();

            return services;
        }
    }
}
