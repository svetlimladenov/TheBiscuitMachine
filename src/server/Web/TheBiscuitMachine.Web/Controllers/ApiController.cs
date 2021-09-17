using Microsoft.AspNetCore.Mvc;

namespace TheBiscuitMachine.Web.Controllers
{
    public class ApiController : ControllerBase
    {
        protected IActionResult BadRequest(string key, string error)
        {
            this.ModelState.AddModelError(key, error);
            return ValidationProblem(this.ModelState);
        }
    }
}
