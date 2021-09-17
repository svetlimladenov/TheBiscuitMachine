using System.Collections.Generic;
using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class RegisterConsumer : BaseConsumer, IConsumer<RegisterRequest>
    {
        private readonly IUserService userService;

        public RegisterConsumer(IUserService userService)
        {
            this.userService = userService;
        }

        public async Task Consume(ConsumeContext<RegisterRequest> context)
        {
            var user = await this.userService.GetUserAsync(context.Message.Username);

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
            var dbUser = await this.userService.AddAsync(user);
            await this.userService.SaveChangesAsync();
            return dbUser.Id;
        }
    }
}
