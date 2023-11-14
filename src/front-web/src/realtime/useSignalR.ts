import { HubConnectionBuilder, IHttpConnectionOptions, JsonHubProtocol } from "@microsoft/signalr";

export const setupSignalRConnection = async (connectionHub: string) => {
  const options : IHttpConnectionOptions = {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
      "Acces-Control-Allow-Origin": window.location.origin.toString(),
      "mode": "no-cors",
      "Content-Type": "application/json",
    }
  }

  const connection = new HubConnectionBuilder()
    .withUrl(connectionHub, options)
    .withAutomaticReconnect()
    .withHubProtocol(new JsonHubProtocol())
    .build();

  connection.serverTimeoutInMilliseconds = 1000 * 60 * 60;
  try {
    await connection.start();
  } catch (err) {
    console.log(err);
  }

  return connection;
};