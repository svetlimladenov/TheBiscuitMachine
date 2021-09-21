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
using TheBiscuitMachine.Data.Common;
using TheBiscuitMachine.Data.Models;
using TheBiscuitMachine.Infrastructure;
using TheBiscuitMachine.Tests.Common;
using Xunit;
using Xunit.Abstractions;

namespace TheBiscuitMachine.Tests.Application.Consumers
{
    public class RegisterConsumerTests : IAsyncLifetime
    {
        private readonly Mock<IBiscuitMachineConfigurator> biscuitMachineConfigurator = new Mock<IBiscuitMachineConfigurator>();
        private readonly Mock<IBiscuitMachinePasswordHasher> passwordHasherMock = new Mock<IBiscuitMachinePasswordHasher>();
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly TheBiscuitMachineContext context;

        private MachineConfiguration defaultMachineConfiguration = new MachineConfiguration()
        {
            Pulse = 2,
            OvenHeatingDuration = TimeSpan.FromSeconds(20),
            OvenOverheatingDuration = TimeSpan.FromSeconds(100),
            OvenColdDuration = TimeSpan.FromSeconds(120)
        };

        public RegisterConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            biscuitMachineConfigurator
                .Setup(x => x.GetDefaultMachineConfig())
                .Returns(defaultMachineConfiguration);

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<RegisterConsumer>();
                    cfg.AddConsumerTestHarness<RegisterConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .AddScoped(x => passwordHasherMock.Object)
                .AddSingleton(x => biscuitMachineConfigurator.Object)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldReturnSuccessAndCreateUserAndMachine_When_UserNotAlreadyRegistered()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            const string password = "password";
            string machineName = $"{username}'s Biscuit Machine";

            var bus = this.serviceProvider.GetRequiredService<IBus>();

            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email, Password = password });

            // Assert
            response.Message.Success.ShouldBeTrue();
            var user = await context.Users.FirstOrDefaultAsync();
            user.Username.ShouldBe(username);
            user.Machine.Name.ShouldBe(machineName);

            user.Machine.Pulse.ShouldBe(this.defaultMachineConfiguration.Pulse);
            user.Machine.OvenHeatingDurationTicks.ShouldBe(this.defaultMachineConfiguration.OvenHeatingDuration.Ticks);
            user.Machine.OvenOverheatingDurationTicks.ShouldBe(this.defaultMachineConfiguration.OvenOverheatingDuration.Ticks);
            user.Machine.OvenColdDurationTicks.ShouldBe(this.defaultMachineConfiguration.OvenColdDuration.Ticks);

            Assert.True(await harness.Consumed.Any<RegisterResponse>());
        }

        [Fact]
        public async Task ShouldReturnFailure_When_UserIsAlreadyRegistered()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            const string password = "password";
            const string passwordHash = "verystronghash";

            AddUser(username, email, passwordHash);

            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email, Password = password });

            // Assert
            response.Message.Success.ShouldBeFalse();
            response.Message.ValidationErrors.ShouldNotBeEmpty();
            context.Users.ShouldHaveSingleItem();
            Assert.True(await harness.Consumed.Any<RegisterResponse>());
        }

        [Fact]
        public async Task ShouldNOTAddUsers_When_TheMachineConfiguratorThrows()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            const string password = "password";
            const string exceptionMessage = "HellOfALife!";

            this.biscuitMachineConfigurator.Setup(x => x.GetDefaultMachineConfig()).Throws(new Exception(exceptionMessage));

            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            try
            {
                var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email, Password = password });
            }
            catch (Exception ex)
            {
                ex.Message.ShouldContain(exceptionMessage);
            }

            context.Users.ShouldBeEmpty();
        }

        [Fact]
        public async Task ShouldNOTAddUsers_When_PasswordHasherFails()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            const string password = "password";
            const string exceptionMessage = "POWER";

            this.passwordHasherMock.Setup(x => x.HashPassword(password)).Throws(new Exception(exceptionMessage));

            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

            // Act
            try
            {
                var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email, Password = password });
            }
            catch (Exception ex)
            {
                ex.Message.ShouldContain(exceptionMessage);
            }
        }

        private void AddUser(string username, string email, string passwordHash)
        {
            context.Users.Add(new User() { Username = username, Email = email, PasswordHash = passwordHash });
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
