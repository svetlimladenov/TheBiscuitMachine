using System;
using System.Collections.Generic;
using TheBiscuitMachine.Data.Common;

namespace TheBiscuitMachine.Data.Models
{
    public class User
    {
        private readonly List<BiscuitPackage> biscuitPackages = new List<BiscuitPackage>();

        public string Id { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string Email { get; set; }

        public string MachineId { get; set; }

        public Machine Machine { get; private set; }

        public List<BiscuitPackage> BiscuitPackages => biscuitPackages;

        public Machine AddMachine(IBiscuitMachineConfigurator biscuitMachineConfigurator)
        {
            var defaults = biscuitMachineConfigurator.GetDefaultMachineConfig();

            var machine = new Machine()
            {
                Id = Guid.NewGuid().ToString(),
                User = this,
                Name = $"{this.Username}'s Biscuit Machine",
                Pulse = defaults.Pulse,
                OvenHeatingDurationTicks = defaults.OvenHeatingDuration.Ticks,
                OvenOverheatingDurationTicks = defaults.OvenOverheatingDuration.Ticks,
                OvenColdDurationTicks = defaults.OvenColdDuration.Ticks
            };

            this.Machine = machine;
            this.MachineId = machine.Id;

            return Machine;
        }

        public BiscuitPackage AddBiscuitPackage(int count)
        {
            var package = new BiscuitPackage()
            {
                User = this,
                UserId = Id,
                BiscuitsCount = count,
                PackageLabel = $"{this.Username}'s Biscuits"
            };

            this.biscuitPackages.Add(package);

            return package;
        }
    }
}
