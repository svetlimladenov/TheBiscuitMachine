namespace TheBiscuitMachine.Data.Common
{
    public interface IBiscuitMachineConfigurator
    {
        // Not async because it will be called from a constructor
        MachineConfiguration GetUserMachineConfig(string userId);

        MachineConfiguration GetDefaultMachineConfig();
    }
}
