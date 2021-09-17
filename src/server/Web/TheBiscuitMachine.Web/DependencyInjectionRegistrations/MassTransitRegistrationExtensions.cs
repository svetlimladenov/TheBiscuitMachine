using System;
using System.Reflection;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using TheBiscuitMachine.Web.Contracts;
using TheBiscuitMachine.Web.Sagas;

namespace TheBiscuitMachine.Web.DependencyInjectionRegistrations
{
    public static class MassTransitRegistrationExtensions
    {
        public static IServiceCollection AddMassTransit(this IServiceCollection services)
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
            });

            services.AddMassTransitHostedService();

            return services;
        }
    }
}
