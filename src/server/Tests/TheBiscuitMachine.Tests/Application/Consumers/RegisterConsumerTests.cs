using System;
using System.Threading.Tasks;
using MassTransit;
using MassTransit.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Shouldly;
using TheBiscuitMachine.Application.Consumers;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Models;
using Xunit;

namespace TheBiscuitMachine.Tests.Application.Consumers
{
    public class RegisterConsumerTests
    {
        private readonly IServiceProvider serviceProvider;
        private readonly InMemoryTestHarness harness;
        private readonly Mock<IUserService> userServiceMock;

        public RegisterConsumerTests()
        {
            userServiceMock = new Mock<IUserService>();

            this.serviceProvider = new ServiceCollection()
                .AddMassTransitInMemoryTestHarness(cfg =>
                {
                    cfg.AddConsumer<RegisterConsumer>();
                    cfg.AddConsumerTestHarness<RegisterConsumer>();
                })
                .AddScoped(x => userServiceMock.Object)
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

            this.userServiceMock.Setup(x => x.GetUserAsync(It.IsAny<string>())).ReturnsAsync(value: null);

            await harness.Start();
            try
            {
                var bus = this.serviceProvider.GetRequiredService<IBus>();

                IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

                // Act
                var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email });

                // Assert
                response.Message.Success.ShouldBeTrue();
                Assert.True(await harness.Consumed.Any<RegisterResponse>());
                this.userServiceMock.Verify(x => x.AddAsync(It.Is<User>(x => x.Username == username && x.Email == email && x.Machine.Name == machineName)));
                this.userServiceMock.Verify(x => x.SaveChangesAsync());
            }
            finally
            {
                await harness.Stop();
            }
        }

        [Fact]
        public async Task ShouldReturnFailure_When_UserIsAlreadyRegistered()
        {
            // Arrange
            const string username = "Yasuo";
            const string email = "yasuo@riot.com";
            this.userServiceMock.Setup(x => x.GetUserAsync(It.IsAny<string>())).ReturnsAsync(new User());

            await harness.Start();
            try
            {
                var bus = this.serviceProvider.GetRequiredService<IBus>();

                IRequestClient<RegisterRequest> client = bus.CreateRequestClient<RegisterRequest>();

                // Act
                var response = await client.GetResponse<RegisterResponse>(new { Username = username, Email = email });

                // Assert
                response.Message.Success.ShouldBeFalse();
                response.Message.ValidationErrors.ShouldNotBeEmpty();
                Assert.True(await harness.Consumed.Any<RegisterResponse>());
            }
            finally
            {
                await harness.Stop();
            }
        }
    }
}
