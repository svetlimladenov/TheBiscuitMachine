using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Consumers;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Infrastructure.Services
{

    public class UserService : IUserService
    {
        private readonly TheBiscuitMachineContext dbContext;

        public UserService(TheBiscuitMachineContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<User> AddAsync(User user)
        {
            var result = await this.dbContext.Users.AddAsync(user);
            return result.Entity;
        }

        public async Task<User> GetUserAsync(string username)
        {
           return await this.dbContext.Users.FirstOrDefaultAsync(x => x.Username == username);
        }

        public async Task<int> SaveChangesAsync()
            => await dbContext.SaveChangesAsync();
    }
}
