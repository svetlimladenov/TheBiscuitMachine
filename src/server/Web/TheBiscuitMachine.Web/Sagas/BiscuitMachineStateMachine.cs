using System;
using Automatonymous;
using MassTransit;
using TheBiscuitMachine.Web.Contracts;

namespace TheBiscuitMachine.Web.Sagas
{
    public class BiscuitMachineStateMachine : MassTransitStateMachine<BiscuitMachineSaga>
    {
        public BiscuitMachineStateMachine()
        {
            InstanceState(x => x.CurrentState);

            Event(() => StartMachineEvent, x =>
            {
                x.CorrelateBy(x => x.UserId, x => x.Message.UserId);

                x.SelectId(ctx => NewId.NextGuid());

                x.SetSagaFactory(ctx => new BiscuitMachineSaga()
                {
                    CurrentState = Initial.Name,
                    CorrelationId = (Guid)ctx.CorrelationId,
                    UserId = ctx.Message.UserId
                });
            });

            Initially(
                When(StartMachineEvent)
                .PublishAsync(ctx => ctx.Init<StartHeatingOven>(new { ctx.Data.UserId }))
                .TransitionTo(Final));

            SetCompletedWhenFinalized();
        }

        public Event<StartBiscuitMachine> StartMachineEvent { get; set; }
    }
}
