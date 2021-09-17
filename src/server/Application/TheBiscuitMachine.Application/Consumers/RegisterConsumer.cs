using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class RegisterConsumer : BaseConsumer, IConsumer<RegisterRequest>
    {
        private readonly IDbContext context;

        public RegisterConsumer(IDbContext context)
        {
            this.context = context;
        }

        public async Task Consume(ConsumeContext<RegisterRequest> context)
        {
            var user = await this.context.Users.FirstOrDefaultAsync(x => x.Username == context.Message.Username);

            if (user != null)
            {
                await context.RespondAsync<RegisterResponse>(CreateValidationErrorResponse(ValidationErrors.UserAlreadyRegistered));
                return;
            }

            var newUser = new User()
            {
                Username = context.Message.Username,
                Email = context.Message.Email
            };

            newUser.AddMachine();
            var userId = await SaveUser(newUser);

            await context.RespondAsync<RegisterResponse>(new { Success = true, UserId = userId });
        }

        private async Task<string> SaveUser(User user)
        {
            var dbUser = await this.context.Users.AddAsync(user);
            await this.context.SaveChangesAsync();
            return dbUser.Entity.Id;
        }
    }
}
