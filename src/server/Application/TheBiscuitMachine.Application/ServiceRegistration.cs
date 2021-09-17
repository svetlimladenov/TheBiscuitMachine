using System;
using System.Reflection;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Application.Sagas;

namespace TheBiscuitMachine.Application
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var schedulerEndpoint = new Uri("queue:scheduler");
            services.AddMassTransit(x =>
            {
                x.AddMessageScheduler(schedulerEndpoint);

                x.UsingInMemory((context, cfg) =>
                {
                    cfg.AutoStart = true;

                    cfg.UseMessageScheduler(schedulerEndpoint);

                    cfg.UseInMemoryScheduler("scheduler");

                    cfg.ConfigureEndpoints(context);
                });

                x.AddSagaStateMachine<BiscuitMachineStateMachine, BiscuitMachineSaga>().InMemoryRepository();
                x.AddConsumers(Assembly.GetExecutingAssembly());

                x.AddRequestClient<LoginRequest>();
                x.AddRequestClient<RegisterRequest>();
            });

            services.AddMassTransitHostedService();

            return services;
        }
    }
}
