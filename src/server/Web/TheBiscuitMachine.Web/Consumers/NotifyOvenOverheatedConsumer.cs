using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Web.Contracts;
using TheBiscuitMachine.Web.Hubs;

namespace TheBiscuitMachine.Web.Consumers
{
    public class NotifyOvenOverheatedConsumer : IConsumer<NotifyOvenOverheated>
    {
        private readonly ILogger<NotifyOvenOverheatedConsumer> logger;
        private readonly IHubContext<MachineHub> hubContext;

        public NotifyOvenOverheatedConsumer(ILogger<NotifyOvenOverheatedConsumer> logger, IHubContext<MachineHub> hubContext)
        {
            this.logger = logger;
            this.hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<NotifyOvenOverheated> context)
        {
            this.logger.LogError("OVERHEATING !!!!");
            await this.hubContext.Clients.All.SendAsync("OvenOverheated");
        }
    }
}
