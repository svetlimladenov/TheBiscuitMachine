using System.Net;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Web.Models;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Users")]
    public class UsersController : ApiController
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
        public async Task<IActionResult> Register(RegisterInputModel user)
        {
            var result = await this.registerRequestClient.GetResponse<RegisterResponse>(new { user.Username, user.Email });

            if (!result.Message.Success)
            {
                return BadRequest(result.Message.ValidationErrors);
            }

            return CreatedAtAction(nameof(GetUser), new { id = result.Message.UserId }, result.Message.UserId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            return Ok();
        }
    }
}
