namespace TheBiscuitMachine.Application.Contracts
{
    public interface RegisterRequest
    {
        string Username { get; }

        string Email { get; }
    }
}
