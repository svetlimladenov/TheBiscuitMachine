using System;
using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class GetMachineSpecificationsConsumer : BaseConsumer, IConsumer<GetMachineSpecifications>
    {
        private readonly IDbContext dbContext;

        public GetMachineSpecificationsConsumer(IDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<GetMachineSpecifications> context)
        {
            var machine = await this.dbContext.Machines
                .Where(x => x.UserId == context.Message.UserId)
                .Select(x => new
                {
                    x.Pulse,
                    OvenHeatingDuration = TimeSpan.FromTicks(x.OvenHeatingDurationTicks),
                    OvenOverheatingDuration = TimeSpan.FromTicks(x.OvenOverheatingDurationTicks),
                    OvenColdDuration = TimeSpan.FromTicks(x.OvenColdDurationTicks)
                })
                .FirstOrDefaultAsync();

            if (machine == null) 
            {
                await context.RespondAsync<MachineSpecificationsResponse>(CreateValidationErrorResponse(ValidationErrors.MachineNotFound));
                return;
            }


            await context.RespondAsync<MachineSpecificationsResponse>(new 
            {
                machine.Pulse,
                machine.OvenHeatingDuration,
                machine.OvenOverheatingDuration,
                machine.OvenColdDuration,
                Success = true
            });
        }
    }
}
