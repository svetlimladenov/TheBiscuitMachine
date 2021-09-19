using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class NotifyOvenHeatedConsumer : IConsumer<NotifyOvenHeated>
    {
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public NotifyOvenHeatedConsumer(ILogger<NotifyOvenHeatedConsumer> logger, IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<NotifyOvenHeated> context)
        {
            await biscuitMachineNotificator.NotifyOvenHeated(context.Message.UserId);
        }
    }
}
