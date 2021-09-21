using System;

namespace TheBiscuitMachine.Application.Contracts
{
    public class MachineConfiguration
    {
        public int Pulse { get; set; }

        public TimeSpan OvenHeatingDuration { get; set; }

        public TimeSpan OvenOverheatingDuration { get; set; }

        public TimeSpan OvenColdDuration { get; set; }
    }
}
