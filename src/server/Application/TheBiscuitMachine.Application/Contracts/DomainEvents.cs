namespace TheBiscuitMachine.Application.Contracts
{
    public static class DomainEvents
    {
        public const string MachineStarted = "MachineStarted";

        public const string MachineStopped = "MachineStopped";

        public const string OvenHeated = "OvenHeated";

        public const string OvenOverheated = "OvenOverheated";

        public const string HeatingElementToggled = "HeatingElementToggled";

        public const string OvenCold = "OvenCold";

        public const string Paused = "Paused";

        public const string Resumed = "Resumed";
    }
}
