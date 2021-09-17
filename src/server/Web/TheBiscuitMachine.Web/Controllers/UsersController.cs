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
        private readonly IRequestClient<LoginRequest> loginRequestClient;
        private readonly IRequestClient<RegisterRequest> registerRequestClient;

        public UsersController(IRequestClient<LoginRequest> requestClient, IRequestClient<RegisterRequest> registerRequestClient)
        {
            this.loginRequestClient = requestClient;
            this.registerRequestClient = registerRequestClient;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(string username)
        {
            var success = await this.loginRequestClient.GetResponse<LoginResponse>(new { Username = username });
            return Ok(success.Message.Success);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(string username, string email)
        {
            var success = await this.registerRequestClient.GetResponse<RegisterResponse>(new { Username = username, Email = email });
            return Ok(success.Message.Success);
        }
    }
}
