using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class NotifyOvenOverheatedConsumer : IConsumer<NotifyOvenOverheated>
    {
        private readonly ILogger<NotifyOvenOverheatedConsumer> logger;
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public NotifyOvenOverheatedConsumer(ILogger<NotifyOvenOverheatedConsumer> logger, IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.logger = logger;
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<NotifyOvenOverheated> context)
        {
            this.logger.LogError("OVERHEATING !!!!");
            await this.biscuitMachineNotificator.NotifyOvenOverheated(context.Message.UserId);
        }
    }
}
