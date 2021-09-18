using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Web.Hubs
{
    public class MachineHub : Hub
    {
        private readonly ILogger<MachineHub> logger;
        private readonly IBus bus;

        public MachineHub(ILogger<MachineHub> logger, IBus bus)
        {
            this.logger = logger;
            this.bus = bus;
        }

        public async Task StartBiscuitMachine(string userId)
        {
            await this.bus.Publish<StartBiscuitMachine>(new { UserId = userId });
        }

        public void DeliverBiscuits(int biscuitsCount)
        {
            this.logger.LogError("Delivering biscuits" + biscuitsCount);
        }
    }
}
