using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Web.Contracts;
using TheBiscuitMachine.Web.Hubs;

namespace TheBiscuitMachine.Web.Consumers
{
    public class NotifyOvenHeatedConsumer : IConsumer<NotifyOvenHeated>
    {
        private readonly ILogger<NotifyOvenHeatedConsumer> logger;
        private readonly IHubContext<MachineHub> hubContext;

        public NotifyOvenHeatedConsumer(ILogger<NotifyOvenHeatedConsumer> logger, IHubContext<MachineHub> hubContext)
        {
            this.logger = logger;
            this.hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<NotifyOvenHeated> context)
        {
            logger.LogError("OVEN HEATED!!!");
            await hubContext.Clients.All.SendAsync("OvenHeated");
        }
    }
}
