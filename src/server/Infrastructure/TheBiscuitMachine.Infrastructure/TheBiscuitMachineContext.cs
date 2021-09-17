using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Data.Models;

namespace TheBiscuitMachine.Infrastructure
{
    public class TheBiscuitMachineContext : DbContext
    {
        public TheBiscuitMachineContext(DbContextOptions<TheBiscuitMachineContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Machine> Machines { get; set; }

        public DbSet<BiscuitPackage> BiscuitPackages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Machine)
                .WithOne(m => m.User)
                .HasForeignKey<Machine>(m => m.UserId);
        }
    }
}
