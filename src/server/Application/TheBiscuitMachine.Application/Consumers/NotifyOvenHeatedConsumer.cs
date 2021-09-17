using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class NotifyOvenHeatedConsumer : IConsumer<NotifyOvenHeated>
    {
        private readonly ILogger<NotifyOvenHeatedConsumer> logger;
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public NotifyOvenHeatedConsumer(ILogger<NotifyOvenHeatedConsumer> logger, IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.logger = logger;
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<NotifyOvenHeated> context)
        {
            logger.LogError("OVEN HEATED!!!");
            await biscuitMachineNotificator.NotifyOvenHeated(context.Message.UserId);
        }
    }
}
