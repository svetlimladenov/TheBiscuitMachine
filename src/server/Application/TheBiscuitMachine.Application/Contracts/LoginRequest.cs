namespace TheBiscuitMachine.Application.Contracts
{
    public interface LoginRequest
    {
        string Username { get; }

        string Password { get;  }
    }
}
