using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Mediator;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Web.Contracts;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Biscuit")]
    public class BiscuitController : ControllerBase
    {
        private readonly IBus mediator;

        public BiscuitController(IBus mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Start(string userId)
        {
            await this.mediator.Publish<StartBiscuitMachine>(new { UserId = userId });

            return Ok();
        }
    }
}
