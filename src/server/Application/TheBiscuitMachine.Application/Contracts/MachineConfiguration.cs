using System;

namespace TheBiscuitMachine.Application.Contracts
{
    public class MachineConfiguration
    {
        public MachineConfiguration(int pulse, TimeSpan heatingTime, TimeSpan overheatingTime, TimeSpan overcoldTime)
        {
            this.Pulse = pulse;
            this.HeatingTime = heatingTime;
            this.OverheatingTime = overheatingTime;
            this.OvenColdTime = overcoldTime;
        }

        public int Pulse { get; set; }

        public TimeSpan HeatingTime { get; set; }

        public TimeSpan OverheatingTime { get; set; }

        public TimeSpan OvenColdTime { get; set; }
    }
}
