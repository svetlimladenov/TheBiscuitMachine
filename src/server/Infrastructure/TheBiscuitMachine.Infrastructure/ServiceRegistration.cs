using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Consumers;
using TheBiscuitMachine.Infrastructure.Services;

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

            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
