using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Infrastructure
{
    public class TheBiscuitMachineContext : DbContext, IDbContext
    {
        public TheBiscuitMachineContext(DbContextOptions<TheBiscuitMachineContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Machine> Machines { get; set; }

        public DbSet<BiscuitPackage> BiscuitPackages { get; set; }

        public DbSet<MachineReport> MachineReports { get; set; }

        public Task<int> SaveChangesAsync()
        {
            return base.SaveChangesAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Machine)
                .WithOne(m => m.User)
                .HasForeignKey<Machine>(m => m.UserId);

            modelBuilder
                .Entity<User>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();

            modelBuilder
                .Entity<Machine>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();

            modelBuilder
                .Entity<BiscuitPackage>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();

            modelBuilder
                .Entity<MachineReport>()
                .Property(e => e.Id)
                .ValueGeneratedOnAdd();
        }
    }
}
