using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Web.Contracts;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Machine")]
    public class BiscuitMachineController : ControllerBase
    {
        private readonly IBus mediator;

        public BiscuitMachineController(IBus mediator)
        {
            this.mediator = mediator;
        }

        [Route("Start")]
        [HttpPost]
        public async Task<IActionResult> Start(string userId)
        {
            await this.mediator.Publish<StartBiscuitMachine>(new { UserId = userId });

            return Ok();
        }
    }
}
