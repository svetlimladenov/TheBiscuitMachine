using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Web.Contracts;
using TheBiscuitMachine.Web.Hubs;

namespace TheBiscuitMachine.Web.Consumers
{
    public class OvenHeatedConsumer : IConsumer<OvenHeated>
    {
        private readonly ILogger<OvenHeatedConsumer> logger;
        private readonly IHubContext<MachineHub> hubContext;

        public OvenHeatedConsumer(ILogger<OvenHeatedConsumer> logger, IHubContext<MachineHub> hubContext)
        {
            this.logger = logger;
            this.hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<OvenHeated> context)
        {
            await hubContext.Clients.All.SendAsync("OvenHeated");
        }
    }
}
