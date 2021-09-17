using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class MachineStartedConsumer : IConsumer<MachineStarted>
    {
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;
        private readonly ILogger<MachineStartedConsumer> logger;

        public MachineStartedConsumer(ILogger<MachineStartedConsumer> logger, IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.logger = logger;
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<MachineStarted> context)
        {
            this.logger.LogError("HEATING THE OVEN ...");

            await biscuitMachineNotificator.NotifyMachineStarted(context.Message.UserId);
        }
    }
}
