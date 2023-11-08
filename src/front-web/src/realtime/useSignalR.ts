import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { ListBySignalR } from "../types/ListBySignalR";

export const useLiveUpdates = () => {
  const [connectionRef, setConnection] = useState < HubConnection > ();
  const updateListHub = "UpdateListObjHub";
  function createHubConnection() {
    const con = new HubConnectionBuilder()
      .withUrl(`https://localhost:7150/gateway/sync/realtime`)
      .withAutomaticReconnect()
      .build();
    setConnection(con);
  }
  
  useEffect(() => {
    createHubConnection();
  }, []);
  
  useEffect(() => {
    if (connectionRef) {
      try {
        connectionRef.start().then(() => {
            connectionRef.on(updateListHub, (item : ListBySignalR) => {
              console.log(item);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      connectionRef?.stop();
    };
  }, [connectionRef]);
};