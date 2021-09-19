using System;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Shouldly;
using TheBiscuitMachine.Application.Common.Interfaces;
using TheBiscuitMachine.Application.Consumers;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;
using TheBiscuitMachine.Infrastructure;
using TheBiscuitMachine.Tests.Common;
using Xunit;
using Xunit.Abstractions;

namespace TheBiscuitMachine.Tests.Application.Consumers
{
    public class NotifyConsumerTests : IAsyncLifetime
    {
        private readonly Mock<IBiscuitMachineNotificator> notificatorMock = new Mock<IBiscuitMachineNotificator>();
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly TheBiscuitMachineContext context;

        public NotifyConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<NotifyConsumer>();
                    cfg.AddConsumerTestHarness<NotifyConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .AddScoped(x => notificatorMock.Object)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldSaveReportsAndNotify_WhenSaveReportFlagIsTrue()
        {
            // Arrange
            const string userId = "12345";
            const string eventName = "OvenHeated";
            const bool saveReport = true;

            AddMachine(userId);

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            // Act
            await bus.Publish<Notification>(new
            {
                UserId = userId,
                Event = eventName,
                SaveReport = saveReport
            });

            // Assert
            Assert.True(await harness.Consumed.Any<Notification>(), "The message was not consumed");
            var report = await context.MachineReports.FirstOrDefaultAsync();
            report.Event.ShouldBe(eventName);
            notificatorMock.Verify(x => x.Notify(userId, eventName), Times.Once);
        }

        [Fact]
        public async Task ShouldOnlyNotify_WhenSaveReportFlagIsFalse()
        {
            // Arrange
            const string userId = "12345";
            const string eventName = "OvenHeated";
            const bool saveReport = false;

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            // Act
            await bus.Publish<Notification>(new
            {
                UserId = userId,
                Event = eventName,
                SaveReport = saveReport
            });

            // Assert
            Assert.True(await harness.Consumed.Any<Notification>(), "The message was not consumed");
            var report = await context.MachineReports.FirstOrDefaultAsync();
            report.ShouldBeNull();
            notificatorMock.Verify(x => x.Notify(userId, eventName), Times.Once);
        }

        private void AddMachine(string userId)
        {
            context.Machines.Add(new Machine() { UserId = userId, Name = "TestMachine" });
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
