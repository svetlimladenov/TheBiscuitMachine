using System;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shouldly;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Common.ValidationErrors;
using TheBiscuitMachine.Application.Consumers;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;
using TheBiscuitMachine.Infrastructure;
using TheBiscuitMachine.Tests.Common;
using Xunit;
using Xunit.Abstractions;

namespace TheBiscuitMachine.Tests.Application.Consumers
{
    public class EditBiscuitMachineConsumerTests : IAsyncLifetime
    {
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly TheBiscuitMachineContext context;

        public EditBiscuitMachineConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<EditBiscuitMachineConsumer>();
                    cfg.AddConsumerTestHarness<EditBiscuitMachineConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldCorrectlyEditTheMachine()
        {
            // Arrange
            const string userId = "13245";
            const int pulse = 2;
            TimeSpan heatingDuration = new TimeSpan(0, 0, 20);
            TimeSpan overheatingDuration = new TimeSpan(0, 0, 20);
            TimeSpan ovenColdDurations = new TimeSpan(0, 1, 20);

            TimeSpan newHeatingDuration = new TimeSpan(0, 1, 50);
            TimeSpan newOverheatingDuration = new TimeSpan(24, 0, 0);
            TimeSpan newOvenColdDuration = new TimeSpan(0, 2, 0);

            AddMachine(userId, pulse, heatingDuration, overheatingDuration, ovenColdDurations);

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<EditBiscuitMachine> client = bus.CreateRequestClient<EditBiscuitMachine>();

            // Act
            var response = await client.GetResponse<EditBiscuitMachineResponse>(new
            {
                UserId = userId,
                Pulse = pulse,
                OvenHeatingDuration = newHeatingDuration.ToString(),
                OvenOverheatingDuration = newOverheatingDuration.ToString(),
                OvenColdDuration = newOvenColdDuration.ToString()
            });

            // Assert
            response.Message.Success.ShouldBeTrue();
            var dbMachine = await context.Machines.FirstOrDefaultAsync();
            dbMachine.Pulse.ShouldBe(pulse);
            dbMachine.OvenHeatingDurationTicks.ShouldBe(newHeatingDuration.Ticks);
            dbMachine.OvenOverheatingDurationTicks.ShouldBe(newOverheatingDuration.Ticks);
            dbMachine.OvenColdDurationTicks.ShouldBe(newOvenColdDuration.Ticks);
            Assert.True(await harness.Consumed.Any<EditBiscuitMachineResponse>());
        }

        [Fact]
        public async Task ShouldReturnValidationError_When_YouTryToEditNonExistingMachine()
        {
            const string userId = "13245";

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<EditBiscuitMachine> client = bus.CreateRequestClient<EditBiscuitMachine>();

            // Act
            var response = await client.GetResponse<EditBiscuitMachineResponse>(new { UserId = userId });

            response.Message.Success.ShouldBeFalse();
            response.Message.ValidationErrors[0].Message.ShouldBe(ValidationErrors.MachineNotFound.Message);
        }

        private void AddMachine(string userId, int pulse, TimeSpan heatingDuration, TimeSpan overheatingDuration, TimeSpan ovenColdDurations)
        {
            context.Machines.Add(new Machine()
            {
                UserId = userId,
                Pulse = pulse,
                OvenHeatingDurationTicks = heatingDuration.Ticks,
                OvenOverheatingDurationTicks = overheatingDuration.Ticks,
                OvenColdDurationTicks = ovenColdDurations.Ticks,
            });
            context.SaveChanges();
        }

        public async Task InitializeAsync()
        {
            await harness.Start();
        }

        public async Task DisposeAsync()
        {
            DbContextFactory.Destroy(context);
            await harness.Stop();
        }
    }
}
