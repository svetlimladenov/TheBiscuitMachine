using System;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class EditBiscuitMachineConsumer : BaseConsumer, IConsumer<EditBiscuitMachine>
    {
        private readonly IDbContext dbContext;

        public EditBiscuitMachineConsumer(IDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<EditBiscuitMachine> context)
        {
            var machine = await dbContext.Machines.FirstOrDefaultAsync(x => x.UserId == context.Message.UserId);

            if (machine == null) 
            {
                await context.RespondAsync<EditBiscuitMachineResponse>(CreateValidationErrorResponse(ValidationErrors.MachineNotFound));
                return;
            }

            machine.Pulse = context.Message.Pulse;
            machine.OvenHeatingDurationTicks = TimeSpan.Parse(context.Message.OvenHeatingDuration).Ticks;
            machine.OvenOverheatingDurationTicks = TimeSpan.Parse(context.Message.OvenOverheatingDuration).Ticks;
            machine.OvenColdDurationTicks = TimeSpan.Parse(context.Message.OvenColdDuration).Ticks;

            await dbContext.SaveChangesAsync();

            await context.RespondAsync<EditBiscuitMachineResponse>(new { UserId = context.Message.UserId, Success = true });
        }
    }
}
