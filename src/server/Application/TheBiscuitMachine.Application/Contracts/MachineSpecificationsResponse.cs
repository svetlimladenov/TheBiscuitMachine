using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Application.Contracts
{
    public interface MachineSpecificationsResponse : IValidatableResponse
    {
        int Pulse { get; }

        string OvenHeatingDuration { get; }

        string OvenOverheatingDuration { get; }

        string OvenColdDuration { get; }
    }
}
