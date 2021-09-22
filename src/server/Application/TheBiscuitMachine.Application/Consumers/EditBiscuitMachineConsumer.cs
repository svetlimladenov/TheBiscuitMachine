using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class EditBiscuitMachineConsumer : BaseConsumer, IConsumer<EditBiscuitMachine>
    {
        public async Task Consume(ConsumeContext<EditBiscuitMachine> context)
        {
            await context.RespondAsync<EditBiscuitMachineResponse>(new { UserId = context.Message.UserId, Success = true });
        }
    }
}
