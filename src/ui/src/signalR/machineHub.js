import * as signalR from "@microsoft/signalr";
import { defaults } from "../shared/fetch";

const events = {
  machineStartedEvent: "MachineStarted",
  ovenHeatedEvent: "OvenHeated",
  ovenOverheatedEvent: "OvenOverheated",
};

const serverEvents = {
  startBiscuitMachine: "StartBiscuitMachine",
  deliverBiscuits: "DeliverBiscuits",
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
  subscribeToOvenHeated(callback) {
    this.hubConnection.on(events.ovenHeatedEvent, callback);
  },
  subscibeToOvenOverheated(callback) {
    this.hubConnection.on(events.ovenOverheatedEvent, callback);
  },
  startMachine(userId) {
    this.hubConnection.invoke(serverEvents.startBiscuitMachine, userId);
  },
  deliverBiscuits(userId) {
    this.hubConnection.invoke(serverEvents.deliverBiscuits, userId);
  },
};

export default MachineHub;
