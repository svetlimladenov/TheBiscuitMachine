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

            Event(() => StartMachine, x =>
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

            Event(() => OvenHeated, x => x.CorrelateBy(x => x.UserId, m => m.Message.UserId));
            Schedule(() => OvenHeatedSchedule, instance => instance.OvenHeatedTimeoutTokenId, s =>
            {
                s.Delay = TimeSpan.FromSeconds(10);
            });

            Initially(
                When(StartMachine)
                    .PublishAsync(ctx => ctx.Init<MachineStarted>(new { ctx.Data.UserId }))
                    .TransitionTo(OvenHeating)
                    .Schedule(OvenHeatedSchedule, ctx => ctx.Init<OvenHeated>(new { ctx.Data.UserId })));

            During(
                OvenHeating,
                When(OvenHeated)
                    .PublishAsync(ctx => ctx.Init<NotifyOvenHeated>(new { ctx.Data.UserId }))
                    .TransitionTo(Final));

            SetCompletedWhenFinalized();
        }

        public State OvenHeating { get; private set; }

        public Event<StartBiscuitMachine> StartMachine { get; private set; }

        public Event<OvenHeated> OvenHeated { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenHeated> OvenHeatedSchedule { get; private set; }
    }
}
