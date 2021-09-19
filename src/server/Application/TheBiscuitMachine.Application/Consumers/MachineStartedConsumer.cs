using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class MachineStartedConsumer : IConsumer<MachineStarted>
    {
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public MachineStartedConsumer(IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<MachineStarted> context)
        {
            await biscuitMachineNotificator.NotifyMachineStarted(context.Message.UserId);
        }
    }
}
