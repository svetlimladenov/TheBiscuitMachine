using System;
using Microsoft.EntityFrameworkCore;
using TheBiscuitMachine.Infrastructure;

namespace TheBiscuitMachine.Tests
{
    public static class DbContextFactory
    {
        public static TheBiscuitMachineContext Create()
        {
            var options = new DbContextOptionsBuilder<TheBiscuitMachineContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            var context = new TheBiscuitMachineContext(options);

            context.Database.EnsureCreated();

            return context;
        }

        public static void Destroy(TheBiscuitMachineContext context)
        {
            context.Database.EnsureDeleted();

            context.Dispose();
        }
    }
}
