namespace TheBiscuitMachine.Web.Models
{
    public class MachineSpecificationsOutputModel
    {
        public int Pulse { get; set; }

        public string OvenHeatingDuration { get; set; }

        public string OvenOverheatingDuration { get; set;}

        public string OvenColdDuration { get; set; }
    }
}