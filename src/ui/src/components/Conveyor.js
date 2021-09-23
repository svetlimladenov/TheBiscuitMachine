import React from "react";
import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import MachineSpecifications from "./MachineSpecifications";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";

import MachineHub, { states } from "../signalR/machine-hub";
import pulse from "../shared/pulse";
import messages from "../shared/messages";
import { now, addLogs } from "../shared/utils";

class Conveyor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [{ message: messages.notStarted, timestamp: now() }],
      infoMessage: messages.notStarted,
      biscuits: [],
      isRunning: false,
      currentId: 0,
      hubConnection: null,
      activeConnectionId: null,
      pulseId: null,
      biscuitBox: [],
      boxSize: 5,
      pulse: null,
      ovenHeatingDuration: null,
      ovenOverheatingDuration: null,
      ovenColdDuration: null,
      isPaused: false,
      heatingElementOn: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.pulseId);
    this.setState((prevState) => {
      prevState.hubConnection.stop();
    });
  }

  componentDidMount() {
    const hubConnection = MachineHub.createConnection("/machinehub");
    MachineHub.subscribeToMachineStartup(this.handleMachineStarted);
    MachineHub.subscribeToOvenHeated(this.handleOvenHeated);
    MachineHub.subscibeToOvenOverheated(this.handleOvenOverheated);
    MachineHub.subscribeToOvenCold(this.handleOvenCold);
    MachineHub.subscribeToMachineStopped(this.handleMachineStopped);
    MachineHub.subscribeToHeatingElementToggled(
      this.handleHeatingElementToggled
    );
    MachineHub.subscribeToPaused(this.handleMachinePaused);
    MachineHub.subscribeToResumed(this.handleMachineResumed);
    MachineHub.subscribeToMachineAlreadyWorking(
      this.handleMachineAlreadyWorking
    );

    this.setState({ hubConnection }, () => {
      hubConnection
        .start()
        .then((result) => {
          MachineHub.joinGroup(this.props.user.id);
        })
        .catch((error) => console.error(error));
    });
  }

  // Web Socket event handlers
  handleMachineStarted = ({
    activeConnectionId,
    pulse,
    ovenHeatingDuration,
    ovenOverheatingDuration,
    ovenColdDuration,
  }) => {
    this.setState((prevState) => {
      const { infoMessage, logs } = addLogs(
        prevState.logs,
        messages.waitingForOvenToBeHeated
      );

      return {
        activeConnectionId,
        heatingElementOn: true,
        pulse,
        infoMessage,
        logs,
        ovenHeatingDuration,
        ovenOverheatingDuration,
        ovenColdDuration,
      };
    });
  };

  handleMachineStopped = () => {
    setTimeout(() => {
      clearInterval(this.state.pulseId);
      this.setState((prevState) => {
        const { infoMessage, logs } = addLogs(
          prevState.logs,
          messages.machineStopped
        );
        return {
          biscuits: [],
          infoMessage,
          logs,
          isRunning: false,
          pulseId: null,
        };
      });
    }, 1000);
  };

  handleOvenHeated = () => {
    this.addLog(messages.ovenHeated);
    this.handleStartConveyor();
  };

  handleOvenOverheated = () => {
    this.addLog(messages.ovenOverheated);
    this.handleMachineStopped();
  };

  handleOvenCold = () => {
    this.addLog(messages.ovenTooCold);
    this.handleMachineStopped();
  };

  handleHeatingElementToggled = () => {
    this.setState((prevState) => {
      return {
        heatingElementOn: !prevState.heatingElementOn,
      };
    });
  };

  handleMachinePaused = () => {
    this.setState({ isPaused: true });
  };

  handleMachineResumed = () => {
    this.setState({ isPaused: false });

    if (this.state.pulseId === null) {
      this.handleStartConveyor();
    }
  };

  handleMachineAlreadyWorking = (state, heatingElementOn, pulse) => {
    this.setState({ heatingElementOn, pulse });
    if (state === states.working) {
      this.handleStartConveyor();
    } else if (state === states.paused) {
      this.handleMachinePaused();
    } else if (state === states.ovenHeating) {
      this.handleMachineStarted();
    }
  };

  // Button click handlers
  handleStartButtonClick = () => {
    MachineHub.startMachine(this.props.user.id);
  };

  handleStopButtonClick = () => {
    MachineHub.stopMachine(this.props.user.id);
  };

  handlePauseToggleButtonClick = () => {
    MachineHub.togglePause(this.props.user.id);
  };

  handleToggleHeatingElement = () => {
    MachineHub.toggleHeatingElement(this.props.user.id);
  };

  handleStartConveyor = () => {
    const pulseId = setInterval(() => {
      if (this.state.isPaused) {
        return;
      }

      if (this.state.biscuitBox.length === this.state.boxSize) {
        this.setState({ biscuitBox: [] });
        this.deliverBiscuits(10);
      }

      this.setState(({ biscuits, biscuitBox, currentId, isRunning }) => {
        const [updatedBiscuits, updatedBox] = pulse(
          biscuits,
          biscuitBox,
          currentId,
          isRunning
        );

        return {
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          biscuitBox: updatedBox,
          isRunning: true,
        };
      });
    }, this.state.pulse * 1000);

    this.setState((prevState) => {
      return {
        ...prevState,
        pulseId: pulseId,
      };
    });
  };

  deliverBiscuits = (biscuitsCount) => {
    if (
      this.state.activeConnectionId === this.state.hubConnection.connectionId
    ) {
      MachineHub.deliverBiscuits(this.props.user.id, biscuitsCount);
    }
  };

  // Utils
  addLog = (message) => {
    this.setState((prevState) => {
      return addLogs(prevState.logs, message);
    });
  };

  clearLogs = () => {
    this.setState({ logs: [] });
  };

  render() {
    const buttonHandlers = {
      handleStartButtonClick: this.handleStartButtonClick,
      handlePauseButtonClick: this.handlePauseToggleButtonClick,
      handleStopButtonClick: this.handleStopButtonClick,
      handleToggleHeatingElement: this.handleToggleHeatingElement,
    };

    return (
      <div>
        <InfoMessage {...this.state.infoMessage} />
        <div className="conveyor-wrapper">
          <MachineComponents />
          <BiscuitBox biscuitBox={this.state.biscuitBox} />
          <MovingBiscuits
            biscuits={this.state.biscuits}
            speed={this.state.pulse}
          />
        </div>
        <Controls
          {...buttonHandlers}
          isPaused={this.state.isPaused}
          heatingElementOn={this.state.heatingElementOn}
        />
        <div className="logs-and-users-wrapper">
          <Logs logs={this.state.logs} clearLogs={this.clearLogs} />
          <MachineSpecifications userId={this.props.user.id} />
        </div>
      </div>
    );
  }
}

export default Conveyor;
