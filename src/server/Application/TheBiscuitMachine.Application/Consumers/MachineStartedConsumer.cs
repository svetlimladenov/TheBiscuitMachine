using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class MachineStartedConsumer : IConsumer<MachineStarted>
    {
        private readonly IDbContext dbContext;
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public MachineStartedConsumer(IBiscuitMachineNotificator biscuitMachineNotificator, IDbContext dbContext)
        {
            this.biscuitMachineNotificator = biscuitMachineNotificator;
            this.dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<MachineStarted> context)
        {
            var machine = await this.dbContext.Machines.FirstOrDefaultAsync(x => x.UserId == context.Message.UserId);

            var report = machine.AddReport("Stop");

            await SaveReport(report);

            await biscuitMachineNotificator.NotifyMachineStarted(context.Message.UserId);
        }

        private async Task SaveReport(MachineReport report)
        {
            await this.dbContext.MachineReports.AddAsync(report);
            await this.dbContext.SaveChangesAsync();
        }
    }
}
