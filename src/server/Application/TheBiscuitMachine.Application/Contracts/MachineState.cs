namespace TheBiscuitMachine.Application.Contracts
{
    public interface MachineState
    {
        string State { get; }

        int Pulse { get; }

        bool HeatingElementOn { get; }
    }
}
