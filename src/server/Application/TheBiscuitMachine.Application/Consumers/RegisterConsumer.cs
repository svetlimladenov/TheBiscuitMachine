using System.Threading.Tasks;
using MassTransit;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public class RegisterConsumer : IConsumer<RegisterRequest>
    {
        private readonly IUserService userRepository;

        public RegisterConsumer(IUserService userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task Consume(ConsumeContext<RegisterRequest> context)
        {
            var message = context.Message;

            var user = await this.userRepository.GetUserAsync(context.Message.Username);

            // User already exists
            if (user != null)
            {
                await context.RespondAsync<RegisterResponse>(new { Success = false });
            }

            var newUser = new User()
            {
                Username = message.Username,
                Email = message.Email
            };

            newUser.AddMachine();
            await SaveUser(newUser);

            await context.RespondAsync<RegisterResponse>(new { Success = true });
        }

        private async Task SaveUser(User user)
        {
            await this.userRepository.AddAsync(user);
            await this.userRepository.SaveChangesAsync();
        }
    }
}
