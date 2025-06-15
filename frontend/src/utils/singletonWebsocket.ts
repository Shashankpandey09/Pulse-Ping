
import { useMonitor } from "../Store/MonitorStore";

let socket: WebSocket | null = null;

export function GetSocket(token: string|null) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`wss://3371-2405-201-600d-8101-c89c-7ff7-8830-899c.ngrok-free.app`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket?.send(JSON.stringify({ token }));
    };
    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.warn("Invalid JSON:", event.data);
        return;
      }
      if (data.type === "monitor_with_history") {
        const updated: any = data.payload;
        // updated contains monitor fields plus updated.history array
        const store = useMonitor.getState();
        const list = store.monitor || [];
        const idx = list.findIndex(m => m.id === updated.id);

        if (idx >= 0) {
          const newList = [...list];
          newList[idx] = updated; // replaces entire monitor object including history
          useMonitor.setState({ monitor: newList });
        } else {
          useMonitor.setState({ monitor: [...list, updated] });
        }
      }
      // handle other data.type if needed...
    };
    socket.onclose = () => { socket = null; };
    socket.onerror = (err) => console.error("WebSocket error", err);
  }
  return socket;
}
