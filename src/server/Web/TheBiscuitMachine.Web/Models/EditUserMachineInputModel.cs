using System;
using System.ComponentModel.DataAnnotations;

namespace TheBiscuitMachine.Web.Models
{
    public class EditUserMachineInputModel
    {
        [Required]
        public string UserId { get; set; }

        public int Pulse { get; set; }

        [RegularExpression(@"(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)", ErrorMessage = "Invalid time format")]
        public string OvenHeatingDuration { get; set; }

        [RegularExpression(@"(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)", ErrorMessage = "Invalid time format")]
        public string OvenOverheatingDuration { get; set; }

        [RegularExpression(@"(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)", ErrorMessage = "Invalid time format")]
        public string OvenColdDuration { get; set; }
    }
}
