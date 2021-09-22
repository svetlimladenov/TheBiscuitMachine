namespace TheBiscuitMachine.Application.Contracts
{
    public interface MachineState
    {
        string State { get; }

        bool HeatingElementOn { get; }
    }
}
