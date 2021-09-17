﻿using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Logging;
using TheBiscuitMachine.Web.Contracts;

namespace TheBiscuitMachine.Web.Consumers
{
    public class LoginConsumer : IConsumer<LoginRequest>
    {
        private readonly ILogger<LoginConsumer> logger;

        public LoginConsumer(ILogger<LoginConsumer> logger)
        {
            this.logger = logger;
        }

        public Task Consume(ConsumeContext<LoginRequest> context)
        {
            logger.LogError("Loginnngg");

            context.RespondAsync<LoginResponse>(new { Success = true });
            return Task.CompletedTask;
        }
    }
}
