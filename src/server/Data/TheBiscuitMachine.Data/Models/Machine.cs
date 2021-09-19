using System;
using System.Collections.Generic;

namespace TheBiscuitMachine.Data.Models
{
    public class Machine
    {
        private List<MachineReport> machineReports = new List<MachineReport>();

        public string Id { get; set; }

        public string Name { get; set; }

        public string UserId { get; set; }

        public User User { get; set; }

        public List<MachineReport> Reports => machineReports;

        public MachineReport AddReport(string eventName)
        {
            var report = new MachineReport()
            {
                Machine = this,
                MachineId = this.Id,
                TimeStamp = DateTime.UtcNow,
                Event = eventName
            };

            this.machineReports.Add(report);

            return report;
        }
    }
}
