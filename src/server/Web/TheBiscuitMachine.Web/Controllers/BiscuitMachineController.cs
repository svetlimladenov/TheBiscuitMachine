using System;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Web.Models;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Machine")]
    public class BiscuitMachineController : ControllerBase
    {
        private readonly IBus mediator;
        private readonly IRequestClient<EditBiscuitMachine> editMachineRequestClient;

        public BiscuitMachineController(IBus bus, IRequestClient<EditBiscuitMachine> editMachineRequestClient)
        {
            this.mediator = bus;
            this.editMachineRequestClient = editMachineRequestClient;
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

        [HttpPut]
        public async Task<IActionResult> EditUserMachine(EditUserMachineInputModel editInput)
        {
            var result = await this.editMachineRequestClient.GetResponse<EditBiscuitMachineResponse>(new
            {
                editInput.Pulse,
                editInput.OvenHeatingDuration,
                editInput.OvenOverheatingDuration,
                editInput.OvenColdDuration
            });

            return Ok(result.Message.UserId);
        }
    }
}
