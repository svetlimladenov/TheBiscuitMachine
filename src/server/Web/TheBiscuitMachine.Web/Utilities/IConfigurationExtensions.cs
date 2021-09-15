using System.Linq;
using Microsoft.Extensions.Configuration;

namespace TheBiscuitMachine.Web.Utilities
{
    public static class IConfigurationExtensions
    {
        public static string[] GetArraySection(this IConfiguration configuration, string section)
            => configuration.GetSection(section)
                .GetChildren()
                .ToArray()
                .Select(x => x.Value)
                .ToArray();
    }
}
