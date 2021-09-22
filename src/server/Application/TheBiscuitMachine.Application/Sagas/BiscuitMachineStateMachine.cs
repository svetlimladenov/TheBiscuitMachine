using System;
using Automatonymous;
using MassTransit;
using TheBiscuitMachine.Application.Contracts;
using TheBiscuitMachine.Data.Common;

namespace TheBiscuitMachine.Application.Sagas
{
    public class BiscuitMachineStateMachine : MassTransitStateMachine<BiscuitMachineSaga>
    {
        public BiscuitMachineStateMachine(IBiscuitMachineConfigurator configurator)
        {
            InstanceState(x => x.CurrentState);

            Event(() => StartMachine, x =>
            {
                x.CorrelateBy(i => i.UserId, m => m.Message.UserId);

                x.SelectId(ctx => NewId.NextGuid());

                x.SetSagaFactory(ctx =>
                {
                    var configuration = configurator.GetUserMachineConfig(ctx.Message.UserId);
                    return new BiscuitMachineSaga()
                    {
                        CurrentState = Initial.Name,
                        CorrelationId = (Guid)ctx.CorrelationId,
                        UserId = ctx.Message.UserId,
                        ActiveConnectionId = ctx.Message.ConnectionId,
                        MachineConfiguration = configuration
                    };
                });
            });

            Event(() => GetMachineState, x =>
            {
                x.CorrelateBy(i => i.UserId, m => m.Message.UserId);

                x.OnMissingInstance(m => m.ExecuteAsync(async context =>
                {
                    if (context.RequestId.HasValue)
                    {
                        await context.RespondAsync<MachineState>(new
                        {
                            State = StateMachineConstants.StateMachineNotFound
                        });
                    }
                }));
            });

            Event(() => OvenHeated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenHeatedSchedule, instance => instance.ScheduleTokenId, s =>
            {
                s.DelayProvider = (ctx) => { return ctx.Instance.MachineConfiguration.OvenHeatingDuration; };
            });

            Event(() => OvenOverheated, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenOverheatedSchedule, instance => instance.ScheduleTokenId, s =>
            {
                s.DelayProvider = (ctx) => { return ctx.Instance.MachineConfiguration.OvenOverheatingDuration; };
            });

            Event(() => StopMachine, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Event(() => ToggleHeatingElement, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));

            Event(() => OvenCold, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));
            Schedule(() => OvenColdSchedule, instance => instance.ScheduleTokenId, s =>
            {
                s.DelayProvider = (ctx) => { return ctx.Instance.MachineConfiguration.OvenColdDuration; };
            });
            Event(() => TogglePause, x => x.CorrelateBy(i => i.UserId, m => m.Message.UserId));

            Initially(
                When(StartMachine)
                    .PublishAsync(ctx => ctx.Init<Notification>(new
                    {
                        ctx.Data.UserId, SaveReport = true,
                        Event = DomainEvents.MachineStarted,
                        Data = new
                        {
                            ActiveConnectionId = ctx.Data.ConnectionId,
                        }
                    }))
                    .Then(ctx =>
                    {
                        ctx.Instance.HeatingElementOn = true;
                    })
                    .TransitionTo(OvenHeating)
                    .Schedule(OvenHeatedSchedule, ctx => ctx.Init<OvenHeated>(new { ctx.Data.UserId })));

            DuringAny(
                When(GetMachineState)
                    .RespondAsync(ctx => ctx.Init<MachineState>(new { State = ctx.Instance.CurrentState })));

            During(
                OvenHeating,
                When(OvenHeated)
                    .PublishSimpleNotification(saveReport: false, DomainEvents.OvenHeated)
                    .Schedule(OvenOverheatedSchedule, ctx => ctx.Init<OvenOverheated>(new { ctx.Data.UserId }))
                    .TransitionTo(Working));

            DuringAny(
                When(ToggleHeatingElement)
                    .IfElse(
                        ctx => ctx.Instance.HeatingElementOn,
                        x => x
                            .Unschedule(OvenOverheatedSchedule)
                            .Schedule(OvenColdSchedule, ctx => ctx.Init<OvenCold>(new { ctx.Data.UserId })),
                        x => x
                            .Unschedule(OvenColdSchedule)
                            .Schedule(OvenOverheatedSchedule, ctx => ctx.Init<OvenOverheated>(new { ctx.Data.UserId })))
                    .PublishSimpleNotification(saveReport: true, DomainEvents.HeatingElementToggled)
                    .Then(ctx => ctx.Instance.HeatingElementOn = !ctx.Instance.HeatingElementOn));

            During(
                Working,
                When(TogglePause)
                    .PublishSimpleNotification(saveReport: true, DomainEvents.Paused)
                    .TransitionTo(Paused));

            During(
                Paused,
                When(TogglePause)
                    .PublishSimpleNotification(saveReport: true, DomainEvents.Resumed)
                    .TransitionTo(Working));

            DuringAny(
                When(StopMachine)
                    .PublishSimpleNotification(saveReport: true, DomainEvents.MachineStopped)
                    .Unschedule(OvenHeatedSchedule)
                    .Unschedule(OvenOverheatedSchedule)
                    .TransitionTo(Final));

            DuringAny(
                When(OvenOverheated)
                    .PublishSimpleNotification(saveReport: true, DomainEvents.OvenOverheated)
                    .TransitionTo(Final));

            DuringAny(
                When(OvenCold)
                    .PublishSimpleNotification(saveReport: true, DomainEvents.OvenCold)
                    .TransitionTo(Final));

            SetCompletedWhenFinalized();
        }

        public State OvenHeating { get; private set; }

        public State Working { get; private set; }

        public State Paused { get; private set; }

        public Event<StartBiscuitMachine> StartMachine { get; private set; }

        public Event<StopBiscuitMachine> StopMachine { get; private set; }

        public Event<OvenHeated> OvenHeated { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenHeated> OvenHeatedSchedule { get; private set; }

        public Event<OvenOverheated> OvenOverheated { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenOverheated> OvenOverheatedSchedule { get; private set; }

        public Event<ToggleHeatingElement> ToggleHeatingElement { get; private set; }

        public Event<OvenCold> OvenCold { get; private set; }

        public Schedule<BiscuitMachineSaga, OvenCold> OvenColdSchedule { get; private set; }

        public Event<TogglePause> TogglePause { get; private set; }

        public Event<GetMachineState> GetMachineState { get; private set; }
    }
}
