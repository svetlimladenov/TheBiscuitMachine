using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MassTransit.Mediator;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Web.Contracts;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Biscuit")]
    public class BiscuitController : ControllerBase
    {
        private readonly IMediator mediator;

        public BiscuitController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Start(string userId)
        {
            await this.mediator.Send<StartBiscuitMachine>(new { UserId = userId });

            return Ok();
        }
    }
}
