using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Web.Services;

namespace TheBiscuitMachine.Web.DependencyInjectionRegistrations
{
    public static class ApplicationServicesRegistrationExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IBiscuitMachineNotificator, BiscuitMachineNotificator>();
            services.AddScoped<IBiscuitMachinePasswordHasher, BiscuitMachinePasswordHasher>();
            return services;
        }
    }
}
