using System.Threading.Tasks;

namespace TheBiscuitMachine.Application.Common.Interfaces
{
    public interface IBiscuitMachineNotificator
    {
        Task NotifyMachineStarted(string userId);

        Task NotifyOvenHeated(string userId);

        Task NotifyOvenOverheated(string userId);
    }
}
