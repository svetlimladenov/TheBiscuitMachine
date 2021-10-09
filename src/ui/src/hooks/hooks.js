import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { defaults } from "../shared/fetch";
import MachineHub from "../signalR/machine-hub";

// export function useMachineHub(groupId, setup) {
//   const [hub, setHub] = useState(null);

//   useEffect(() => {
//     console.log("Use Machine Hub Effect");
//     const machineHub = new MachineHub();

//     machineHub.start().then(() => {
//       machineHub.joinGroup(groupId);
//       setup(machineHub);
//       setHub(machineHub);
//     });

//     return () => {
//       console.log("unmounting...");
//       if (machineHub) {
//         machineHub.stopConnection();
//         setHub(null);
//       }
//     };
//   }, [groupId, setHub, setup]);

//   return hub;
// }

export const useMachineHub = (groupId) => {};
