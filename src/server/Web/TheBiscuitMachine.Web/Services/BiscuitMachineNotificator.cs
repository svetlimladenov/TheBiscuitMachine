using System.Text.Json;
using System.Threading.Tasks;
using MassTransit.Serialization;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        public async Task Notify(string userId, string eventName, object data)
        {
            await this.hub.Clients.Group(userId).SendAsync(eventName, data);
        }
    }
}
