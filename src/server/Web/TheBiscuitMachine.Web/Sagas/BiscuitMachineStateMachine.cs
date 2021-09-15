using Automatonymous;

namespace TheBiscuitMachine.Web.Sagas
{
    public class BiscuitMachineStateMachine : MassTransitStateMachine<BiscuitMachineSaga>
    {
        public BiscuitMachineStateMachine()
        {
            InstanceState(x => x.CurrentState);
        }
    }
}
