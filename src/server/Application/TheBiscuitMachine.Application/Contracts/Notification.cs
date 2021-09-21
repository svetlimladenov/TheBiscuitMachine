namespace TheBiscuitMachine.Application.Contracts
{
    public interface Notification
    {
        string UserId { get; }

        string Event { get; }

        bool SaveReport { get; }

        object Data { get; }
    }
}
