import { useMemo } from "react";
import { useMonitor } from "../Store/MonitorStore";


export const useMonitorStat=()=>{
 const { monitor} = useMonitor();
 const monitorList=Array.isArray(monitor)?monitor:[]

const stats = useMemo(() => {
    const totalMonitors = monitorList.length;
    const upMonitors = monitorList.filter((m)=>m.history[0].lastStatus==="up").length
    const downMonitors = monitorList.filter((m)=>m.history[0].lastStatus==="down").length
    const pendingMonitors = monitorList.filter(m => m.currentStatus === 'pending').length;
   
    const totalChecks = monitorList.reduce((sum, m) => sum + m.history.length, 0);
    const upChecks = monitorList.reduce(
      (sum, m) => sum + m.history.filter(h => h.lastStatus === 'up').length,
      0
    );

    const uptimePercentage = totalChecks > 0
      ? (upChecks / totalChecks * 100).toFixed(2)
      : '0.00';

    const responseTimes = monitorList.flatMap(m =>
      m.history
        .filter(h =>h.responseTime !== null)
        .map(h => h.responseTime as number)
    );

    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
      : 0;
const recentIncidents = () => {
const downMonitors = monitor?.filter(m => m.history.some(entry => entry.lastStatus === 'down'))
  .slice(0, 3);
  

    return downMonitors;

}

    return {
      totalMonitors,
      upMonitors,
      downMonitors,
      pendingMonitors,
      uptimePercentage,
      avgResponseTime,
      recentIncidents
    };
  }, [monitorList]);
  return stats;
}