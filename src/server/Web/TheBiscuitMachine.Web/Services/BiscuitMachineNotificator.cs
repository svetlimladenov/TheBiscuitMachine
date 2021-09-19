using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Web.Hubs;

namespace TheBiscuitMachine.Web.Services
{
    public class BiscuitMachineNotificator : IBiscuitMachineNotificator
    {
        private readonly IHubContext<MachineHub> hub;

        public BiscuitMachineNotificator(IHubContext<MachineHub> hub)
        {
            this.hub = hub;
        }

        public async Task Notify(string userId, string eventName)
        {
            await this.hub.Clients.Group(userId).SendAsync(eventName);
        }
    }
}
