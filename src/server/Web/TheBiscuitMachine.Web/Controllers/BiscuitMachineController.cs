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

        /// <summary>
        /// Use only for manual start of a machine, otherwise use the Hub method
        /// </summary>
        /// <param name="userId">The user id, for which we want to start a machine</param>
        /// <returns>A result of the execution</returns>
        [Route("Start")]
        [HttpPost]
        public async Task<IActionResult> Start(string userId)
        {
            await this.mediator.Publish<StartBiscuitMachine>(new { UserId = userId });

            return Ok();
        }
    }
}
