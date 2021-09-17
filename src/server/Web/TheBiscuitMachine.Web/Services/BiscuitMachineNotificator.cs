﻿using System.Threading.Tasks;
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

        public async Task NotifyMachineStarted(string userId)
        {
            await this.hub.Clients.All.SendAsync("MachineStarted", userId);
        }

        public async Task NotifyOvenHeated(string userId)
        {
            await this.hub.Clients.All.SendAsync("OvenHeated");
        }

        public async Task NotifyOvenOverheated(string userId)
        {
            await this.hub.Clients.All.SendAsync("OvenOverheated");
        }
    }
}