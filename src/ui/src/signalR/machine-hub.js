import * as signalR from "@microsoft/signalr";
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

const MachineHub = {
  createConnection(url) {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${defaults.signalRUrl}${url}`)
      .build();

    this.hubConnection = hubConnection;
    return hubConnection;
  },
  subscribeToMachineStartup(callback) {
    this.hubConnection.on(events.machineStartedEvent, callback);
  },
  subscribeToMachineStopped(callback) {
    this.hubConnection.on(events.machineStoppedEvent, callback);
  },
  subscribeToOvenHeated(callback) {
    this.hubConnection.on(events.ovenHeatedEvent, callback);
  },
  subscibeToOvenOverheated(callback) {
    this.hubConnection.on(events.ovenOverheatedEvent, callback);
  },
  subscribeToOvenCold(callback) {
    this.hubConnection.on(events.ovenColdEvent, callback);
  },
  subscribeToHeatingElementToggled(callback) {
    this.hubConnection.on(events.heatingElementToggled, callback);
  },
  subscribeToPaused(callback) {
    this.hubConnection.on(events.paused, callback);
  },
  subscribeToResumed(callback) {
    this.hubConnection.on(events.resumed, callback);
  },
  subscribeToMachineAlreadyWorking(callback) {
    this.hubConnection.on(events.machineAlreadyWorking, callback);
  },
  joinGroup(userId) {
    this.hubConnection.invoke(serverEvents.joinGroup, userId);
  },
  startMachine(userId) {
    this.hubConnection.invoke(serverEvents.startBiscuitMachine, userId);
  },
  stopMachine(userId) {
    this.hubConnection.invoke(serverEvents.stopBiscuitMachine, userId);
  },
  toggleHeatingElement(userId) {
    this.hubConnection.invoke(serverEvents.toggleHeatingElement, userId);
  },
  deliverBiscuits(userId, biscuitsCount) {
    this.hubConnection.invoke(
      serverEvents.deliverBiscuits,
      userId,
      biscuitsCount
    );
  },
  togglePause(userId) {
    this.hubConnection.invoke(serverEvents.togglePause, userId);
  },
};

export default MachineHub;

const states = {
  ovenHeating: "OvenHeating",
  working: "Working",
  paused: "Paused",
};

export { states };
