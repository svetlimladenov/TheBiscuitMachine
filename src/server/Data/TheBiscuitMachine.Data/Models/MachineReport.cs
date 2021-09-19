using System;

namespace TheBiscuitMachine.Data.Models
{
    public class MachineReport
    {
        public string Id { get; set; }

        public string MachineId { get; set; }

        public Machine Machine { get; set; }

        public DateTime TimeStamp { get; set; }

        public string Event { get; set; }
    }
}
