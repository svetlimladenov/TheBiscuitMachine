namespace TheBiscuitMachine.Application.Contracts
{
    public interface StartBiscuitMachine
    {
        string UserId { get; }

       /// <summary>
       /// Gets the web socket connection id
       /// </summary>
        string ConnectionId { get; }
    }
}
