using Microsoft.AspNetCore.Mvc;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Users")]
    public class UsersController : ControllerBase
    {
        [HttpPost("Login")]
        public IActionResult Login()
        {
            return Ok();
        }

        [HttpPost("Register")]
        public IActionResult Register()
        {
            return Ok();
        }
    }
}
