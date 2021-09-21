using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Data.Common;

namespace TheBiscuitMachine.Infrastructure
{
    public class BiscuitMachineConfigurator : IBiscuitMachineConfigurator
    {
        private const string SectionKey = "DefaultMachineConfigurations";

        private const string PulseKey = "Pulse";
        private const string OvenHeatingDurationKey = "OvenHeatingDuration";
        private const string OvenOverheatingDurationKey = "OvenOverheatingDuration";
        private const string OvenColdDurationKey = "OvenColdDuration";

        private readonly IServiceScopeFactory scopeFactory;
        private readonly IConfiguration configuration;

        public BiscuitMachineConfigurator(IServiceScopeFactory scopeFactory, IConfiguration configuration)
        {
            this.scopeFactory = scopeFactory;
            this.configuration = configuration;
        }

        public MachineConfiguration GetUserMachineConfig(string userId)
        {
            MachineConfiguration machineConfiguration;
            using (var scope = scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<IDbContext>();
                machineConfiguration = context.Machines
                    .Where(x => x.UserId == userId)
                    .Select(x => new MachineConfiguration()
                    {
                        Pulse = x.Pulse,
                        OvenHeatingDuration = TimeSpan.FromTicks(x.OvenHeatingDurationTicks),
                        OvenOverheatingDuration = TimeSpan.FromTicks(x.OvenOverheatingDurationTicks),
                        OvenColdDuration = TimeSpan.FromTicks(x.OvenColdDurationTicks)
                    })
                    .FirstOrDefault();
            }

            return machineConfiguration;
        }

        public MachineConfiguration GetDefaultMachineConfig()
        {
            return new MachineConfiguration()
            {
                Pulse = int.Parse(ReadFromMachineConfigSection(PulseKey)),
                OvenHeatingDuration = TimeSpan.Parse(ReadFromMachineConfigSection(OvenHeatingDurationKey)),
                OvenOverheatingDuration = TimeSpan.Parse(ReadFromMachineConfigSection(OvenOverheatingDurationKey)),
                OvenColdDuration = TimeSpan.Parse(ReadFromMachineConfigSection(OvenColdDurationKey))
            };
        }

        private string ReadFromMachineConfigSection(string key)
            => this.configuration[$"{SectionKey}:{key}"];
    }
}
