using System.Collections.Generic;
using System.Linq;
using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Application.Common.Consumer
{
    public abstract class BaseConsumer
    {
        protected object CreateValidationErrorResponse(params ValidationError[] errors)
        {
            var response = new
            {
                Success = false,
                ValidationErrors = errors.ToList()
            };

            return response;
        }
    }
}
