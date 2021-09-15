using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Core;

namespace TheBiscuitMachine.Web.Infrastructure
{
    public static class LoggerFactory
    {
        public static Logger SetupLogger(IConfiguration configuration)
        {
            return new LoggerConfiguration()
                .Enrich.FromLogContext()
                .ReadFrom
                .Configuration(configuration)
                .WriteTo.Console()
                .CreateLogger();
        }
    }
}
