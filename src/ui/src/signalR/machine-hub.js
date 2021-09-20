import * as signalR from "@microsoft/signalr";
import { defaults } from "../shared/fetch";

const events = {
  machineStartedEvent: "MachineStarted",
  machineStoppedEvent: "MachineStopped",
  ovenHeatedEvent: "OvenHeated",
  ovenColdEvent: "OvenCold",
  ovenOverheatedEvent: "OvenOverheated",
  heatingElementToggled: "HeatingElementToggled",
};

const serverEvents = {
  joinGroup: "JoinGroup",
  startBiscuitMachine: "StartBiscuitMachine",
  stopBiscuitMachine: "StopBiscuitMachine",
  deliverBiscuits: "DeliverBiscuits",
  toggleHeatingElement: "ToggleHeatingElement",
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
};

export default MachineHub;
