using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Application.Sagas;

namespace TheBiscuitMachine.Infrastructure
{
    public class BiscuitMachineDatabaseConfigurator : IBiscuitMachineConfigurator
    {
        private readonly IServiceScopeFactory scopeFactory;

        public BiscuitMachineDatabaseConfigurator(IServiceScopeFactory scopeFactory)
        {
            this.scopeFactory = scopeFactory;
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
    }
}
