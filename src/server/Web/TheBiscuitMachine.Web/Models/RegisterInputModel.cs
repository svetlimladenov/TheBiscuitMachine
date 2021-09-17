using System.ComponentModel.DataAnnotations;

namespace TheBiscuitMachine.Web.Models
{
    public class RegisterInputModel
    {
        [MinLength(3)]
        [MaxLength(20)]
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
