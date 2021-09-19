namespace TheBiscuitMachine.Application.Contracts
{
    public interface SaveBiscuits
    {
        string UserId { get; }

        int BiscuitsCount { get; }
    }
}
