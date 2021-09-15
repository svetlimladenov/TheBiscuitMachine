using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace TheBiscuitMachine.Web.Hubs
{
    public class MachineHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("Test", user, message);
        }
    }
}
