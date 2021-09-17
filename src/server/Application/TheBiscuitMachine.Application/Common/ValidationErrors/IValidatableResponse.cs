using System.Collections.Generic;

namespace TheBiscuitMachine.Application.Common.ValidationErrors
{
    public interface IValidatableResponse
    {
        bool Success { get; }

        List<ValidationError> ValidationErrors { get; }
    }
}
