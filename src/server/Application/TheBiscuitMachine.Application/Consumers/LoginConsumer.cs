using System.Linq;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Application.Common.Consumer;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Consumers
{
    public class LoginConsumer : BaseConsumer, IConsumer<LoginRequest>
    {
        private readonly IBiscuitMachinePasswordHasher passwordHasher;
        private readonly IDbContext dbContext;

        public LoginConsumer(IBiscuitMachinePasswordHasher passwordHasher, IDbContext dbContext)
        {
            this.passwordHasher = passwordHasher;
            this.dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<LoginRequest> context)
        {
            var user = await this.dbContext
                .Users
                .Where(x => x.Username == context.Message.Username)
                .Select(x => new
                {
                    x.Id,
                    x.PasswordHash
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                await context.RespondAsync<LoginResponse>(CreateValidationErrorResponse(ValidationErrors.UserNotFound));
                return;
            }

            var passwordVerificationResult = this.passwordHasher.VerifyHashedPassword(user.PasswordHash, context.Message.Password);
            if (!passwordVerificationResult)
            {
                await context.RespondAsync<LoginResponse>(CreateValidationErrorResponse(ValidationErrors.WrongPassword));
                return;
            }

            await context.RespondAsync<LoginResponse>(new { UserId = user.Id, Success = true });
        }
    }
}
