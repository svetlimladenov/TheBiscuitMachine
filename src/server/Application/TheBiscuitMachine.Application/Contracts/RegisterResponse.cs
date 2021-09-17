using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Application.Contracts
{
    public interface RegisterResponse : IValidatableResponse
    {
        string UserId { get; }
    }
}
