using System.Threading.Tasks;

namespace TheBiscuitMachine.Application.Common.Interfaces
{
    public interface IBiscuitMachineNotificator
    {
        Task Notify(string userId, string eventName);
    }
}
