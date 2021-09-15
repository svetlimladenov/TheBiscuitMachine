using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog.Extensions.Logging;

namespace TheBiscuitMachine.Web.DependencyInjectionRegistrations
{
    public static class LoggerFactoryRegistrationExtensions
    {
        public static IServiceCollection AddLoggerFactory(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            serviceCollection.AddSingleton<Serilog.ILogger>(_ => Infrastructure.LoggerFactory.SetupLogger(configuration));

            return serviceCollection.AddSingleton<ILoggerFactory, SerilogLoggerFactory>();
        }
    }
}
