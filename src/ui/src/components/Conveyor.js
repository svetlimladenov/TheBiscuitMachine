import React from "react";
import BiscuitBox from "./BiscuitBox";
import MachineComponents from "./MachineComponent";
import Controls from "./Controls";
import InfoMessage from "./InfoMessage";
import User from "./User";
import Logs from "./Logs";
import MovingBiscuits from "./MovingBiscuits";

import MachineHub from "../signalR/machine-hub";
import pulse from "../shared/pulse";
import messages from "../shared/messages";

class Conveyor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [messages.notStarted],
      infoMessage: messages.notStarted,
      biscuits: [],
      isRunning: false,
      step: 0,
      currentId: 0,
      hubConnection: null,
      activeConnectionId: null,
      pulseId: null,
      biscuitBox: [],
      boxSize: 5,
      speed: 3,
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
  handleMachineStarted = ({ activeConnectionId }) => {
    this.setState({ activeConnectionId, heatingElementOn: true });
    this.addLog(messages.waitingForOvenToBeHeated);
  };

  handleMachineStopped = () => {
    setTimeout(() => {
      clearInterval(this.state.pulseId);
      this.setState({
        biscuits: [],
        infoMessage: messages.machineStopped,
        isRunning: false,
        pulseId: null,
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

  // Button click handlers
  handleStartButtonClick = () => {
    MachineHub.startMachine(this.props.user.id);
  };

  handleStopButtonClick = () => {
    MachineHub.stopMachine(this.props.user.id);
  };

  handlePauseButtonClick = () => {
    this.setState((prevState) => {
      return {
        isPaused: !prevState.isPaused,
      };
    });
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
        this.deliverBiscuits(this.props.user.id, 10);
      }

      this.setState(({ step, biscuits, biscuitBox, currentId, isRunning }) => {
        const [updatedBiscuits, updatedBox] = pulse(
          biscuits,
          biscuitBox,
          currentId,
          isRunning
        );

        return {
          step: step + 1,
          currentId: currentId + 1,
          biscuits: updatedBiscuits,
          biscuitBox: updatedBox,
          isRunning: true,
        };
      });
    }, this.state.speed * 1000);

    this.setState((prevState) => {
      return {
        ...prevState,
        pulseId: pulseId,
      };
    });
  };

  deliverBiscuits = () => {
    if (
      this.state.activeConnectionId === this.state.hubConnection.connectionId
    ) {
      MachineHub.deliverBiscuits(this.props.user.id, 5);
    }
  };

  // Utils
  addLog = (message) => {
    this.setState((prevState) => {
      return {
        infoMessage: message,
        logs: [...prevState.logs, message],
      };
    });
  };

  render() {
    const buttonHandlers = {
      handleStartButtonClick: this.handleStartButtonClick,
      handlePauseButtonClick: this.handlePauseButtonClick,
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
            speed={this.state.speed}
          />
        </div>
        <Controls
          {...buttonHandlers}
          isPaused={this.state.isPaused}
          heatingElementOn={this.state.heatingElementOn}
        />
        <Logs logs={this.state.logs} />
        <User userId={this.props.user.id} />
      </div>
    );
  }
}

export default Conveyor;
