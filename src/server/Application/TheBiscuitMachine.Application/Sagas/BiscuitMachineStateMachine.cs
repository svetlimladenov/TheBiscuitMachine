using System;
using Automatonymous;
using MassTransit;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Sagas
{
    public class BiscuitMachineStateMachine : MassTransitStateMachine<BiscuitMachineSaga>
    {
        public BiscuitMachineStateMachine()
        {
            InstanceState(x => x.CurrentState);

            Event(() => StartMachine, x =>
            {
                x.CorrelateBy(i => i.UserId, m => m.Message.UserId);

                x.SelectId(ctx => NewId.NextGuid());

                x.SetSagaFactory(ctx => new BiscuitMachineSaga()
                {
                    CurrentState = Initial.Name,
                    CorrelationId = (Guid)ctx.CorrelationId,
                    UserId = ctx.Message.UserId
                });
            });

            Event(() => OvenHeated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenHeatedSchedule, instance => instance.ScheduleTokenId, s => s.Delay = TimeSpan.FromSeconds(1));
            Event(() => OvenOverheated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenOverheatedSchedule, instance => instance.ScheduleTokenId, s => s.Delay = TimeSpan.FromSeconds(100));
            Event(() => StopMachine, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));

            Initially(
                When(StartMachine)
                    .PublishAsync(ctx => ctx.Init<MachineStarted>(new { ctx.Data.UserId }))
                    .TransitionTo(OvenHeating)
                    .Schedule(OvenHeatedSchedule, ctx => ctx.Init<OvenHeated>(new { ctx.Data.UserId })));

            During(
                OvenHeating,
                When(OvenHeated)
                    .PublishAsync(ctx => ctx.Init<NotifyOvenHeated>(new { ctx.Data.UserId }))
                    .Schedule(OvenOverheatedSchedule, ctx => ctx.Init<OvenOverheated>(new { ctx.Data.UserId }))
                    .TransitionTo(Working));

            DuringAny(
                When(StopMachine)
                    .PublishAsync(ctx => ctx.Init<NotifyMachineStopped>(new { ctx.Data.UserId }))
                    .Unschedule(OvenHeatedSchedule)
                    .Unschedule(OvenOverheatedSchedule)
                    .TransitionTo(Final));

            DuringAny(
                When(OvenOverheated)
                    .PublishAsync(ctx => ctx.Init<NotifyOvenOverheated>(new { ctx.Data.UserId }))
                    .TransitionTo(Final));

            SetCompletedWhenFinalized();
        }

        public State OvenHeating { get; private set; }

        public State Working { get; private set; }

        public Event<StartBiscuitMachine> StartMachine { get; private set; }

        public Event<StopBiscuitMachine> StopMachine { get; private set; }

        public Event<OvenHeated> OvenHeated { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenHeated> OvenHeatedSchedule { get; private set; }

        public Event<OvenOverheated> OvenOverheated { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenOverheated> OvenOverheatedSchedule { get; private set; }
    }
}
