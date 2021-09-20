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
                    UserId = ctx.Message.UserId,
                    ActiveConnectionId = ctx.Message.ConnectionId
                });
            });

            Event(() => OvenHeated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenHeatedSchedule, instance => instance.ScheduleTokenId, s => s.Delay = TimeSpan.FromSeconds(10));
            Event(() => OvenOverheated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenOverheatedSchedule, instance => instance.ScheduleTokenId, s => s.Delay = TimeSpan.FromSeconds(20));
            Event(() => StopMachine, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Event(() => ToggleHeatingElement, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));

            Event(() => OvenCold, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenColdSchedule, instance => instance.ScheduleTokenId, s => s.Delay = TimeSpan.FromSeconds(20));

            Initially(
                When(StartMachine)
                    .PublishAsync(ctx => ctx.Init<Notification>(new { ctx.Data.UserId, SaveReport = true, Event = DomainEvents.MachineStarted, ctx.Instance.ActiveConnectionId }))
                    .Then(ctx =>
                    {
                        ctx.Instance.HeatingElementOn = true;
                    })
                    .TransitionTo(OvenHeating)
                    .Schedule(OvenHeatedSchedule, ctx => ctx.Init<OvenHeated>(new { ctx.Data.UserId })));

            During(
                OvenHeating,
                When(OvenHeated)
                    .PublishAsync(ctx => ctx.Init<Notification>(new { ctx.Data.UserId, SaveReport = false, Event = DomainEvents.OvenHeated }))
                    .Schedule(OvenOverheatedSchedule, ctx => ctx.Init<OvenOverheated>(new { ctx.Data.UserId }))
                    .TransitionTo(Working));

            During(
                Working,
                When(ToggleHeatingElement)
                    .IfElse(
                        ctx => ctx.Instance.HeatingElementOn,
                        x => x
                            .Unschedule(OvenOverheatedSchedule)
                            .Schedule(OvenColdSchedule, ctx => ctx.Init<OvenCold>(new { ctx.Data.UserId })),
                        x => x
                            .Unschedule(OvenColdSchedule)
                            .Schedule(OvenOverheatedSchedule, ctx => ctx.Init<OvenOverheated>(new { ctx.Data.UserId })))
                    .Then(ctx => ctx.Instance.HeatingElementOn = !ctx.Instance.HeatingElementOn));

            DuringAny(
                When(StopMachine)
                    .PublishAsync(ctx => ctx.Init<Notification>(new { ctx.Data.UserId, SaveReport = true, Event = DomainEvents.MachineStopped }))
                    .Unschedule(OvenHeatedSchedule)
                    .Unschedule(OvenOverheatedSchedule)
                    .TransitionTo(Final));

            DuringAny(
                When(OvenOverheated)
                    .PublishAsync(ctx => ctx.Init<Notification>(new { ctx.Data.UserId, SaveReport = true, Event = DomainEvents.OvenOverheated }))
                    .TransitionTo(Final));

            DuringAny(
                When(OvenCold)
                    .PublishAsync(ctx => ctx.Init<Notification>(new { ctx.Data.UserId, SaveReport = true, Event = DomainEvents.OvenCold }))
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

        public Event<ToggleHeatingElement> ToggleHeatingElement { get; private set; }

        public Event<OvenCold> OvenCold { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenCold> OvenColdSchedule { get; private set; }
    }
}
