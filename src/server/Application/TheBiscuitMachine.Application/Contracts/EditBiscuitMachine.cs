namespace TheBiscuitMachine.Application.Contracts
{
    public interface EditBiscuitMachine
    {
        public string UserId { get; set; }

        public int Pulse { get; set; }

        public string OvenHeatingDuration { get; set; }

        public string OvenOverheatingDuration { get; set; }

        public string OvenColdDuration { get; set; }
    }
}
