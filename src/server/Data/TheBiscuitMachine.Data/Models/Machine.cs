namespace TheBiscuitMachine.Data.Models
{
    public class Machine
    {
        public string Id { get; set; }

        public string UserId { get; set; }

        public User User { get; set; }
    }
}
