import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { defaults } from "../shared/fetch";

const events = {
  machineStartedEvent: "MachineStarted",
  machineStoppedEvent: "MachineStopped",
  ovenHeatedEvent: "OvenHeated",
  ovenColdEvent: "OvenCold",
  ovenOverheatedEvent: "OvenOverheated",
  heatingElementToggled: "HeatingElementToggled",
  paused: "Paused",
  resumed: "Resumed",
  machineAlreadyWorking: "MachineAlreadyWorking",
};

const serverEvents = {
  joinGroup: "JoinGroup",
  startBiscuitMachine: "StartBiscuitMachine",
  stopBiscuitMachine: "StopBiscuitMachine",
  deliverBiscuits: "DeliverBiscuits",
  toggleHeatingElement: "ToggleHeatingElement",
  togglePause: "TogglePause",
};

const MachineHubSingleton = (() => {
  let connection = null;
  let subscribers = [];
  const startHubConnection = async (userId) => {
    if (
      connection?.state === HubConnectionState.Connected ||
      connection?.state === HubConnectionState.Connecting ||
      connection?.state === HubConnectionState.Reconnecting
    ) {
      return;
    }

    connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(`${defaults.signalRUrl}/machinehub`)
      .build();

    try {
      await connection.start();
      joinGroup(userId);
      subscribers.forEach((subscriber) => subscriber());
    } catch (error) {
      console.error(error);
    }
  };

  const stopHubConnection = async () => {
    try {
      await connection.stop();
      console.log("Connection closed...");
    } catch (error) {
      console.error(error);
    }
  };

  const addSubscriber = (event, callback) => {
    console.log("setup");
    if (connection?.state !== HubConnectionState.Connected) {
      subscribers.push(() => {
        connection.on(event, callback);
      });
    } else {
      connection.on(event, callback);
    }
  };

  const subscribeToMachineStartup = (callback) => {
    addSubscriber(events.machineStartedEvent, callback);
  };

  const subscribeToMachineStopped = (callback) => {
    addSubscriber(events.machineStoppedEvent, callback);
  };

  const subscribeToOvenHeated = (callback) => {
    addSubscriber(events.ovenHeatedEvent, callback);
  };

  const subscibeToOvenOverheated = (callback) => {
    addSubscriber(events.ovenOverheatedEvent, callback);
  };

  const subscribeToOvenCold = (callback) => {
    addSubscriber(events.ovenColdEvent, callback);
  };

  const subscribeToHeatingElementToggled = (callback) => {
    addSubscriber(events.heatingElementToggled, callback);
  };

  const subscribeToPaused = (callback) => {
    addSubscriber(events.paused, callback);
  };

  const subscribeToResumed = (callback) => {
    addSubscriber(events.resumed, callback);
  };

  const subscribeToMachineAlreadyWorking = (callback) => {
    addSubscriber(events.machineAlreadyWorking, callback);
  };

  const joinGroup = (userId) => {
    connection.invoke(serverEvents.joinGroup, userId);
  };

  const startMachine = (userId) => {
    connection.invoke(serverEvents.startBiscuitMachine, userId);
  };

  const stopMachine = (userId) => {
    connection.invoke(serverEvents.stopBiscuitMachine, userId);
  };

  const toggleHeatingElement = (userId) => {
    connection.invoke(serverEvents.toggleHeatingElement, userId);
  };

  const deliverBiscuits = (userId, biscuitsCount) => {
    connection.invoke(serverEvents.deliverBiscuits, userId, biscuitsCount);
  };

  const togglePause = (userId) => {
    connection.invoke(serverEvents.togglePause, userId);
  };

  return {
    startHubConnection,
    stopHubConnection,
    subscribeToMachineStartup,
    subscribeToMachineStopped,
    subscribeToOvenHeated,
    subscibeToOvenOverheated,
    subscribeToOvenCold,
    subscribeToHeatingElementToggled,
    subscribeToPaused,
    subscribeToResumed,
    subscribeToMachineAlreadyWorking,
    joinGroup,
    startMachine,
    stopMachine,
    togglePause,
    toggleHeatingElement,
    deliverBiscuits,
  };
})();

export default MachineHubSingleton;

const states = {
  ovenHeating: "OvenHeating",
  working: "Working",
  paused: "Paused",
};

export { states };
