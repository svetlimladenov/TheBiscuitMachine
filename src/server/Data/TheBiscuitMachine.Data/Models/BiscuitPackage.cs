﻿namespace TheBiscuitMachine.Data.Models
{
    public class BiscuitPackage
    {
        public string Id { get; set; }

        public string UserId { get; set; }

        public string PackageLabel { get; set; }

        public int BiscuitsCount { get; set; }

        public User User { get; set; }
    }
}
