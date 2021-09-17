using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Users")]
    public class UsersController : ControllerBase
    {
        private readonly IRequestClient<LoginRequest> requestClient;

        public UsersController(IRequestClient<LoginRequest> requestClient)
        {
            this.requestClient = requestClient;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(string username)
        {
            var success = await this.requestClient.GetResponse<LoginResponse>(new { Username = username });
            return Ok();
        }

        [HttpPost("Register")]
        public IActionResult Register()
        {
            return Ok();
        }
    }
}
