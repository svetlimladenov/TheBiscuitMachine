using Automatonymous;
using Automatonymous.Binders;
using MassTransit;
using TheBiscuitMachine.Application.Contracts;

namespace TheBiscuitMachine.Application.Sagas
{
    public static class BiscuitMachineStateMachineExtensions
    {
        // If you need to access the message context, you should use the regular Publish()
        // E.g: ctx.Data.ConnectionId<code
        public static EventActivityBinder<BiscuitMachineSaga, TMessage> PublishSimpleNotification<TMessage>(this EventActivityBinder<BiscuitMachineSaga, TMessage> binder, bool saveReport, string eventName)
            where TMessage : class
        {
            return binder.PublishAsync(ctx => ctx.Init<Notification>(new
            {
                ctx.Instance.UserId,
                SaveReport = saveReport,
                Event = eventName
            }));
        }
    }
}
