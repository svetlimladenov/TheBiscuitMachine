using System.Collections.Generic;

namespace TheBiscuitMachine.Data.Models
{
    public class User
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string MachineId { get; set; }

        public Machine Machine { get; set; }

        public List<BiscuitPackage> BiscuitPackages { get; set; }
    }
}
