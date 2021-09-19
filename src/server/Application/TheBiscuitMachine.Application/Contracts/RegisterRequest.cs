namespace TheBiscuitMachine.Application.Contracts
{
    public interface RegisterRequest
    {
        string Username { get; }

        string Password { get;  }

        string Email { get; }
    }
}
