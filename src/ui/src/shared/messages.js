const messages = {
  notStarted: {
    text: "Machine not started",
    color: "white",
  },
  waitingForOvenToBeHeated: {
    text: "Machine started, waiting for the oven to be heated...",
    color: "white",
  },
  machineStopping: {
    text: "Machine stopping...",
    color: "white",
  },
  machineStopped: {
    text: "Machine stopped!",
    color: "white",
  },
  ovenHeated: {
    text: "Oven heated, starting the conveyor...",
    color: "white",
  },
  machineWorking: {
    text: "Machine working!",
    color: "white",
  },
  ovenOverheated: {
    text: "Oven overheated, stopping the conveyor...",
    color: "red",
  },
  ovenTooCold: {
    text: "Oven too cold, stopping the conveyor...",
    color: "lightblue",
  },
};

export default messages;
