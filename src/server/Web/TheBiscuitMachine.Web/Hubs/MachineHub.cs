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

        public async Task JoinGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);

            var requestClient = this.bus.CreateRequestClient<GetMachineState>();

            var response = await requestClient.GetResponse<MachineState>(new { UserId = userId });

            logger.LogError("STATE - " + response.Message.State);
            if (response.Message.State != StateMachineConstants.StateMachineNotFound)
            {
                // It means that we have an actual machine running, and we have to sync our new connection
            }
        }

        public async Task StartBiscuitMachine(string userId)
        {
            await this.bus.Publish<StartBiscuitMachine>(new { UserId = userId, Context.ConnectionId });
        }

        public async Task StopBiscuitMachine(string userId)
        {
            await this.bus.Publish<StopBiscuitMachine>(new { UserId = userId, Context.ConnectionId });
        }

        public async Task DeliverBiscuits(string userId, int biscuitsCount)
        {
            await this.bus.Publish<SaveBiscuits>(new { UserId = userId, BiscuitsCount = biscuitsCount });
        }

        public async Task ToggleHeatingElement(string userId)
        {
            await this.bus.Publish<ToggleHeatingElement>(new { UserId = userId });
        }

        public async Task TogglePause(string userId)
        {
            await this.bus.Publish<TogglePause>(new { UserId = userId });
        }
    }
}
