using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Application.Common.ValidationErrors;

namespace TheBiscuitMachine.Web.Controllers
{
    public class ApiController : ControllerBase
    {
        protected IActionResult BadRequest(List<ValidationError> list)
        {
            foreach (var error in list)
            {
                this.ModelState.AddModelError(error.Key, error.Message);
            }

            return ValidationProblem(this.ModelState);
        }
    }
}
