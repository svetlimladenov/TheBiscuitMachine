using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Application.Contracts
{
    public interface EditBiscuitMachineResponse : IValidatableResponse
    {
        string UserId { get; }
    }
}
