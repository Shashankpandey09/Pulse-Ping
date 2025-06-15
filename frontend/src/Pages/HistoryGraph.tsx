import { useEffect } from "react";
import MonitorGraph from "../Components/MonitorHistoryGraph";
import { useMonitor } from "../Store/MonitorStore";
import { useToken } from "../hooks/getToken";
import { useParams } from "react-router-dom";

const HistoryGraph = () => {
  const { getMonitors, monitor } = useMonitor();
  const { token } = useToken();
  const { id } = useParams();
  const monitorId = Number(id);

  useEffect(() => {
    if (monitor.length === 0) {
      getMonitors(token);
    }
  }, [token, id]);

  const filteredMonitor = monitor.find((m) => m.id === monitorId);

  if (!filteredMonitor) {
    return <div className="w-full h-full flex items-center justify-center text-white">Loading monitor...</div>;
  }

  return (
    <div className="h-full flex items-center w-full">
      <MonitorGraph history={filteredMonitor.history} monitor={filteredMonitor} />
    </div>
  );
};

export default HistoryGraph;
