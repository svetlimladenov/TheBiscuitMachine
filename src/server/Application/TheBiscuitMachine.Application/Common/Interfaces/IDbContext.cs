using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Application.Common.Interfaces
{
    public interface IDbContext
    {
        DbSet<User> Users { get; set; }

        DbSet<Machine> Machines { get; set; }

        DbSet<BiscuitPackage> BiscuitPackages { get; set; }

        DbSet<MachineReport> MachineReports { get; set; }

        Task<int> SaveChangesAsync();
    }
}
