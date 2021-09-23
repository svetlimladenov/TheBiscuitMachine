using System;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
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
    public class GetMachineSpecificationsConsumerTests : IAsyncLifetime
    {
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly TheBiscuitMachineContext context;

        public GetMachineSpecificationsConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<GetMachineSpecificationsConsumer>();
                    cfg.AddConsumerTestHarness<GetMachineSpecificationsConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldReturnCorrectMachineSpecs()
        {
            // Arrange
            const string userId = "13245";
            const int pulse = 2;
            TimeSpan heatingDuration = new TimeSpan(0, 0, 20);
            TimeSpan overheatingDuration = new TimeSpan(0, 0, 20);
            TimeSpan ovenColdDurations = new TimeSpan(0, 1, 20);

            AddMachine(userId, pulse, heatingDuration, overheatingDuration, ovenColdDurations);

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<GetMachineSpecifications> client = bus.CreateRequestClient<GetMachineSpecifications>();

            // Act
            var response = await client.GetResponse<MachineSpecificationsResponse>(new { UserId = userId });

            // Assert
            response.Message.OvenHeatingDuration.ShouldBe(heatingDuration.ToString());
            response.Message.OvenOverheatingDuration.ShouldBe(overheatingDuration.ToString());
            response.Message.OvenColdDuration.ShouldBe(ovenColdDurations.ToString());
            response.Message.Success.ShouldBeTrue();
            Assert.True(await harness.Consumed.Any<MachineSpecificationsResponse>());
        }

        [Fact]
        public async Task ShouldReturnValidationError_When_TheMachineDoesNotExist()
        {
            const string userId = "13245";

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<GetMachineSpecifications> client = bus.CreateRequestClient<GetMachineSpecifications>();

            // Act
            var response = await client.GetResponse<MachineSpecificationsResponse>(new { UserId = userId });

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

