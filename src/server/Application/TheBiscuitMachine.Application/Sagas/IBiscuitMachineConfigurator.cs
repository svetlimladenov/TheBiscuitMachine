using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Sagas
{
    public interface IBiscuitMachineConfigurator
    {
        // Not async because it will be called from a constructor
        MachineConfiguration GetUserMachineConfig(string userId);
    }
}
