using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Application.Contracts
{
    public interface LoginResponse : IValidatableResponse
    {
        string UserId { get; }
    }
}
