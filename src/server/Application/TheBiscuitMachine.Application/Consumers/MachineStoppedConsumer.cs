using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class MachineStoppedConsumer : IConsumer<NotifyMachineStopped>
    {
        private readonly IBiscuitMachineNotificator biscuitMachineNotificator;

        public MachineStoppedConsumer(IBiscuitMachineNotificator biscuitMachineNotificator)
        {
            this.biscuitMachineNotificator = biscuitMachineNotificator;
        }

        public async Task Consume(ConsumeContext<NotifyMachineStopped> context)
        {
            await this.biscuitMachineNotificator.NotifyMachineStopped(context.Message.UserId);
        }
    }
}
