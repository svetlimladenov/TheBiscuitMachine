// import { HubConnectionBuilder } from "@microsoft/signalr";
// import { defaults } from "../shared/fetch";

// const createSocketMiddleware = () => {
//   return storeAPI => {
//     let socker = createSocketConnetion();
//   }
// }

// const createConnection = async (groupId) => {
//   const connection = new HubConnectionBuilder()
//     .withUrl(`${defaults.signalRUrl}/machinehub`)
//     .build();

//   await connection.start();
//   await connection.invoke("JoinGroup", groupId);

//   return connection;
// };
