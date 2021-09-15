using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Web.Contracts;
using TheBiscuitMachine.Web.Hubs;

namespace TheBiscuitMachine.Web.Consumers
{
    public class OvenConsumer : IConsumer<StartOven>
    {
        private readonly IHubContext<MachineHub> hubContext;
        private readonly ILogger<OvenConsumer> logger;

        public OvenConsumer(ILogger<OvenConsumer> logger)
        {
            this.logger = logger;
        }

        public async Task Consume(ConsumeContext<StartOven> context)
        {
            this.logger.LogError("HEATING THE OVEN ...");

            var userId = context.Message.UserId;

            await this.hubContext.Clients.All.SendAsync("ReceiveMessage", userId);
        }
    }
}
