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
                var machine = context.Machines.FirstOrDefault(x => x.UserId == userId);
                machineConfiguration = new MachineConfiguration(2, TimeSpan.FromSeconds(100), TimeSpan.FromSeconds(20), TimeSpan.FromSeconds(20));
            }

            return machineConfiguration;
        }
    }
}
