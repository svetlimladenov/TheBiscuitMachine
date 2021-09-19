using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class MachineStoppedConsumer : IConsumer<NotifyMachineStopped>
    {
        private readonly IDbContext dbContext;
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public MachineStoppedConsumer(IBiscuitMachineNotificator biscuitMachineNotificator, IDbContext dbContext)
        {
            this.biscuitMachineNotificator = biscuitMachineNotificator;
            this.dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<NotifyMachineStopped> context)
        {
            var machine = await this.dbContext.Machines.FirstOrDefaultAsync(x => x.UserId == context.Message.UserId);

            var report = machine.AddReport("Stop");

            await SaveReport(report);

            await this.biscuitMachineNotificator.NotifyMachineStopped(context.Message.UserId);
        }

        private async Task SaveReport(MachineReport report)
        {
            await this.dbContext.MachineReports.AddAsync(report);
            await this.dbContext.SaveChangesAsync();
        }
    }
}
