import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions, JsonHubProtocol } from "@microsoft/signalr";
import { ListDTO } from "../services/authentication/lists/dtos/ListDTO";
import { ListItemDTO } from "../services/authentication/lists/dtos/ListItemDTO";
import { useCallback, useEffect, useRef } from "react";

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

export interface ListRealTimeProps {
  listCallback(list : ListDTO) : void;
  listItemCallback(listItem : ListItemDTO) : void
  deleteListItemCallback(id : number) : void
  deleteListCallback(id : number) : void
}

export const useConnexaRealTime = ({listCallback, listItemCallback, deleteListItemCallback, deleteListCallback} : ListRealTimeProps) => {
  const idOwner = localStorage.getItem('userId');
  const connexaRealTimeAddress = "https://localhost:7102/connexa/api/sync/realtime";
  const listRealTimeHub = "UpdateListObjHub";
  const listItemRealTimeHub = "UpdateListItemObjHub";
  const deleteListItemRealTimeHub = "DeleteListItemObjHub";
  const deleteListRealTimeHub = "DeleteListObjHub";
  const connecting = useRef(false);
  const delaySeconds = useRef(10);
  const timeoutId = useRef<NodeJS.Timeout>();
  let connection : HubConnection | null = null;


  const connect = useCallback(async () => {
      if (!connection || connection?.state === HubConnectionState.Disconnected) {
        connection = await setupSignalRConnection(connexaRealTimeAddress);

        connection?.on(listRealTimeHub, (list: ListDTO) => {
          listCallback(list);
        });

        connection?.on(listItemRealTimeHub, (listItem: ListItemDTO) => {
          listItemCallback(listItem);
        });

        connection?.on(deleteListItemRealTimeHub, (id : number) => {
          deleteListItemCallback(id);
        });

        connection?.on(deleteListRealTimeHub, (id : number) => {
          deleteListCallback(id);
        });
      }
  }, [listCallback, listItemCallback, deleteListItemCallback, deleteListCallback])

  const subscribe = useCallback(async () => {
    if (connecting.current) return;
    connecting.current = true;
    await connect();
    connecting.current = false;
    if (connection?.state !== HubConnectionState.Connected) {
      delaySeconds.current = Math.min(60, delaySeconds.current + 10);
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(subscribe, delaySeconds.current * 1000);
      return;
    }

    if(connection?.state === HubConnectionState.Connected)
      await connection.invoke('Subscribe', Number(idOwner));
  }, [connect, connection, idOwner]);

  const disconnect = useCallback(async () => {
    if (connection?.state !== HubConnectionState.Connected) return;
    connection?.off(listRealTimeHub);
    await connection?.stop();
  }, [connection]);

  const unsubscribe = useCallback(async () => {
    if (connection?.state !== HubConnectionState.Connected) return;
    await connection.invoke('Unsubscribe', Number(idOwner));
    await disconnect();
  },[connection, disconnect, idOwner]);

  useEffect(() => {
    if (idOwner) {
      subscribe();
    }
    return () => {
      unsubscribe();
      clearTimeout(timeoutId.current);
    };

  }, [idOwner, subscribe, unsubscribe]);
}

