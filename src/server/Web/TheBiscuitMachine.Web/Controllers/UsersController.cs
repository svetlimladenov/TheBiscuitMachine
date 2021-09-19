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
        public async Task<IActionResult> Login(LoginInputModel loginInput)
        {
            var result = await this.loginRequestClient.GetResponse<LoginResponse>(new { loginInput.Username, loginInput.Password });

            if (!result.Message.Success)
            {
                return BadRequest(result.Message.ValidationErrors);
            }

            return Ok(result.Message.UserId);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterInputModel registerInput)
        {
            var result = await this.registerRequestClient.GetResponse<RegisterResponse>(new { registerInput.Username, registerInput.Password, registerInput.Email });

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
