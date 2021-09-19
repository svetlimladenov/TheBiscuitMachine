using System.ComponentModel.DataAnnotations;

namespace TheBiscuitMachine.Web.Models
{
    public class RegisterInputModel
    {
        [MinLength(3)]
        [MaxLength(20)]
        [Required]
        public string Username { get; set; }

        [MinLength(6)]
        [MaxLength(30)]
        [Required]
        public string Password { get; set; }

        [MinLength(6)]
        [MaxLength(30)]
        [Required]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
