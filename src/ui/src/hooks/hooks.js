import { useState, useEffect } from "react";
import MachineHub from "../signalR/machine-hub";

export function useMachineHub(groupId, setup) {
  const [hub, setHub] = useState(null);

  useEffect(() => {
    console.log("Use Machine Hub Effect");
    const machineHub = new MachineHub();

    machineHub.start().then(() => {
      machineHub.joinGroup(groupId);
      setup(machineHub);
      setHub(machineHub);
    });

    return () => {
      console.log("unmounting...");
      if (machineHub) {
        machineHub.stopConnection();
        setHub(null);
      }
    };
  }, [groupId, setHub, setup]);

  return hub;
}
