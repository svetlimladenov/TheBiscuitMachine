using System.Threading.Tasks;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Consumers
{
    public interface IUserService
    {
        Task<User> GetUserAsync(string username);

        Task<User> AddAsync(User user);

        Task<int> SaveChangesAsync();
    }
}
