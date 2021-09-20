using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class SaveBiscuitsConsumer : IConsumer<SaveBiscuits>
    {
        private readonly IDbContext context;

        public SaveBiscuitsConsumer(IDbContext dbContext)
        {
            this.context = dbContext;
        }

        // Consider receiving this event from the state machine
        public async Task Consume(ConsumeContext<SaveBiscuits> context)
        {
            var user = await this.context.Users.FindAsync(context.Message.UserId);

            var package = user.AddBiscuitPackage(context.Message.BiscuitsCount);

            await SavePackage(package);
        }

        private async Task SavePackage(BiscuitPackage package)
        {
            await this.context.BiscuitPackages.AddAsync(package);
            await this.context.SaveChangesAsync();
        }
    }
}
