import * as signalR from "@microsoft/signalr";

const events = {
  machineStartedEvent: "MachineStarted",
  ovenHeatedEvent: "OvenHeated",
  ovenOverheatedEvent: "OvenOverheated",
};

const MachineHub = {
  createConnection(url) {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
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
};

export const serverEvents = {
  start: "Start",
  deliverBiscuits: "DeliverBiscuits",
};

export default MachineHub;
