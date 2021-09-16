using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Automatonymous;

namespace TheBiscuitMachine.Web.Sagas
{
    public class BiscuitMachineSaga : SagaStateMachineInstance
    {
        public Guid CorrelationId { get; set; }

        public string UserId { get; set; }

        public string CurrentState { get; set; }

        public Guid? OvenHeatedTimeoutTokenId { get; set; }
    }
}
