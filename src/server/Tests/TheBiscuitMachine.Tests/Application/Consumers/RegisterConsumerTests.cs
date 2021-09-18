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
    public class RegisterConsumerTests : IAsyncLifetime
    {
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly TheBiscuitMachineContext context;

        public RegisterConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<RegisterConsumer>();
                    cfg.AddConsumerTestHarness<RegisterConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldReturnSuccess_When_UserNotAlreadyRegistered()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            string machineName = $"{username}'s Biscuit Machine";

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email });

            // Assert
            response.Message.Success.ShouldBeTrue();
            var user = await context.Users.FirstOrDefaultAsync();
            user.Username.ShouldBe(username);
            user.Machine.Name.ShouldBe(machineName);
            Assert.True(await harness.Consumed.Any<RegisterResponse>());
        }

        [Fact]
        public async Task ShouldReturnFailure_When_UserIsAlreadyRegistered()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";

            AddUser(username, email);

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email });

            // Assert
            response.Message.Success.ShouldBeFalse();
            response.Message.ValidationErrors.ShouldNotBeEmpty();
            context.Users.ShouldHaveSingleItem();
            Assert.True(await harness.Consumed.Any<RegisterResponse>());
        }

        private void AddUser(string username, string email)
        {
            context.Users.Add(new User() { Username = username, Email = email });
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
