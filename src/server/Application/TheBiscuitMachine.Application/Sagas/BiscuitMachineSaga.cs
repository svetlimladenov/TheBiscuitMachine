using System;
using Automatonymous;

namespace TheBiscuitMachine.Application.Sagas
{
    public class BiscuitMachineSaga : SagaStateMachineInstance
    {
        public Guid CorrelationId { get; set; }

        public string UserId { get; set; }

        public string CurrentState { get; set; }

        public string ActiveConnectionId { get; set; }

        public bool HeatingElementOn { get; set; }

        public Guid? ScheduleTokenId { get; set; }
    }
}
