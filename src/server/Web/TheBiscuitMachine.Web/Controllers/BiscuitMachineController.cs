using System;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Web.Models;

namespace TheBiscuitMachine.Web.Controllers
{
    [ApiController]
    [Route("Machine")]
    public class BiscuitMachineController : ControllerBase
    {
        private readonly IBus bus;
        private readonly IRequestClient<EditBiscuitMachine> editMachineRequestClient;

        private readonly IRequestClient<GetMachineSpecifications> getMachineSpecificationsClient;

        public BiscuitMachineController(
            IBus bus,
            IRequestClient<EditBiscuitMachine> editMachineRequestClient,
            IRequestClient<GetMachineSpecifications> getMachineSpecificationsClient)
        {
            this.bus = bus;
            this.editMachineRequestClient = editMachineRequestClient;
            this.getMachineSpecificationsClient = getMachineSpecificationsClient;
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
            await this.bus.Publish<StartBiscuitMachine>(new { UserId = userId });

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetMachineSpecifications(string userId)
        {
            var result = await this.getMachineSpecificationsClient.GetResponse<MachineSpecificationsResponse>(new { UserId = userId });

            if (!result.Message.Success)
            {
                return BadRequest(result.Message.ValidationErrors);
            }

            var outputModel = new MachineSpecificationsOutputModel()
            {
                Pulse = result.Message.Pulse,
                OvenHeatingDuration = result.Message.OvenHeatingDuration,
                OvenOverheatingDuration = result.Message.OvenOverheatingDuration,
                OvenColdDuration = result.Message.OvenColdDuration
            };

            return Ok(outputModel);
        }

        [HttpPut]
        public async Task<IActionResult> EditUserMachine(EditUserMachineInputModel editInput)
        {
            var result = await this.editMachineRequestClient.GetResponse<EditBiscuitMachineResponse>(new
            {
                editInput.UserId,
                editInput.Pulse,
                editInput.OvenHeatingDuration,
                editInput.OvenOverheatingDuration,
                editInput.OvenColdDuration
            });

            return Ok(result.Message.UserId);
        }
    }
}
