using System;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
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
    public class LoginConsumerTests : IAsyncLifetime
    {
        private readonly Mock<IBiscuitMachinePasswordHasher> passwordHasherMock = new Mock<IBiscuitMachinePasswordHasher>();
        private readonly IServiceProvider serviceProvider;
        private readonly TheBiscuitMachineContext context;
        private readonly InMemoryTestHarness harness;

        public LoginConsumerTests(ITestOutputHelper testOutputHelper)
        {
            context = DbContextFactory.Create();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<LoginConsumer>();
                    cfg.AddConsumerTestHarness<LoginConsumer>();
                })
                .AddSingleton<ILoggerFactory>(provider => new TestOutputLoggerFactory(true, testOutputHelper))
                .AddSingleton<IDbContext>(x => context)
                .AddScoped(x => passwordHasherMock.Object)
                .BuildServiceProvider(true);

            this.harness = this.serviceProvider.GetRequiredService<InMemoryTestHarness>();
        }

        [Fact]
        public async Task ShouldReturnCorrectUserId_When_LogingWithCorrectPassword()
        {
            // Arrange
            const string id = "12345-54321";
            const string username = "Yone";
            const string password = "for-damacia";
            const string email = "yone@riot.com";

            this.passwordHasherMock.Setup(x => x.VerifyHashedPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(true);

            AddUser(id, username, email, password);

            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<LoginRequest> client = bus.CreateRequestClient<LoginRequest>();

            // Act
            var response = await client.GetResponse<LoginResponse>(new { Username = username, Password = password });

            // // Assert
            response.Message.Success.ShouldBeTrue();
            response.Message.UserId.ShouldBe(id);
            Assert.True(await harness.Consumed.Any<LoginResponse>());
        }

        [Fact]
        public async Task ShouldReturnValidationError_When_TheUserDoesNotExists()
        {
            // Arrange
            const string username = "Yone";
            const string password = "for-damacia";

            this.passwordHasherMock.Setup(x => x.VerifyHashedPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<LoginRequest> client = bus.CreateRequestClient<LoginRequest>();

            // Act
            var response = await client.GetResponse<LoginResponse>(new { Username = username, Password = password });

            // Assert
            response.Message.Success.ShouldBeFalse();
            response.Message.ValidationErrors.ShouldNotBeEmpty();
            Assert.True(await harness.Consumed.Any<LoginResponse>());
        }

        [Fact]
        public async Task ShouldReturnValidationError_When_LogingWithWrongPassword()
        {
            // Arrange
            const string id = "12345-54321";
            const string username = "Yone";
            const string password = "for-damacia";
            const string email = "yone@riot.com";

            this.passwordHasherMock.Setup(x => x.VerifyHashedPassword(It.IsAny<string>(), It.IsAny<string>())).Returns(false);

            AddUser(id, username, email, password);

            var bus = this.serviceProvider.GetRequiredService<IBus>();
            IRequestClient<LoginRequest> client = bus.CreateRequestClient<LoginRequest>();

            // Act
            var response = await client.GetResponse<LoginResponse>(new { Username = username, Password = password });

            // Assert
            response.Message.Success.ShouldBeFalse();
            response.Message.ValidationErrors.ShouldNotBeEmpty();
            Assert.True(await harness.Consumed.Any<LoginResponse>());
        }

        private void AddUser(string id, string username, string email, string passwordHash)
        {
            context.Users.Add(new User() { Id = id, Username = username, Email = email, PasswordHash = passwordHash });
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
