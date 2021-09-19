using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class NotifyConsumer : IConsumer<Notification>
    {
        private readonly IDbContext dbContext;
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public NotifyConsumer(IDbContext dbContext, IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.dbContext = dbContext;
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<Notification> context)
        {
            if (context.Message.SaveReport)
            {
                var machine = await this.dbContext.Machines.FirstOrDefaultAsync(x => x.UserId == context.Message.UserId);
                var report = machine.AddReport(context.Message.Event);

                await SaveReport(report);
            }

            await biscuitMachineNotificator.Notify(context.Message.UserId, context.Message.Event);
        }

        private async Task SaveReport(MachineReport report)
        {
            await this.dbContext.MachineReports.AddAsync(report);
            await this.dbContext.SaveChangesAsync();
        }
    }
}
