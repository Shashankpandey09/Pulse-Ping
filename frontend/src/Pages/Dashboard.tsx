import React, { useMemo } from 'react';
import {  Clock, Activity, CheckCircle,  XCircle } from 'lucide-react';
import MonitorStatusBadge from '../Components/MonitorStatusBadge';
import { StatCard } from '../Components/StatCard';
import { StatusItem } from '../Components/StatusItem';
import { useMonitor } from '../Store/MonitorStore';

const Dashboard: React.FC = () => {
  const {getMonitors,monitor } = useMonitor();
  
  const stats = useMemo(() => {
    const totalMonitors = monitor.length;
    const upMonitors = monitor.filter(m => m.currentStatus === 'up').length;
    const downMonitors = monitor.filter(m => m.currentStatus === 'down').length;
    const pendingMonitors = monitor.filter(m => m.currentStatus === 'pending').length;
    
    // Calculate uptime percentage across all monitor
    const totalChecks = monitor.reduce((sum, monitor) => sum + monitor.history.length, 0);
    const upChecks = monitor.reduce(
      (sum, monitor) => sum + monitor.history.filter(h => h.lastStatus === 'up').length, 
      0
    );
    
    const uptimePercentage = totalChecks > 0 
      ? (upChecks / totalChecks * 100).toFixed(2) 
      : '0.00';
    
    // Average response time for up monitor
    const responseTimes = monitor
      .filter((m,i) => m.currentStatus === 'up' && m.history[i].responseTime !== null)
      .map((m,i) => m.history[i].responseTime as number);
    
    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
      : 0;
    
    return {
      totalMonitors,
      upMonitors,
      downMonitors,
      pendingMonitors,
      uptimePercentage,
      avgResponseTime
    };
  }, [monitor]);

  const recentIncidents = useMemo(() => {
    // Get monitor that have had a recent down status in their history
    return monitor
      .filter(monitor => 
        monitor.history.some(entry => entry.lastStatus === 'down')
      )
      .slice(0, 3); // Limit to 3 most recent
  }, [monitor]);
  
  return (
    <div className=' bg-gray-100 w-screen h-screen'>
     <div className='max-w-[1280px]  mx-auto p-4'>
      <h2 className="text-2xl font-bold mb-6 ">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Monitors" 
          value={stats.totalMonitors.toString()}
          icon={<Activity className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        <StatCard 
          title="Uptime" 
          value={`${stats.uptimePercentage}%`}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          color="green"
        />
        <StatCard 
          title="Avg Response Time" 
          value={`${stats.avgResponseTime} ms`}
          icon={<Clock className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
        <StatCard
          title="Outages" 
          value={stats.downMonitors.toString()}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          color="red"
          change={stats.downMonitors > 0 ? '+' + stats.downMonitors : '0'}
          changeType={stats.downMonitors > 0 ? 'negative' : 'positive'}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Status Overview
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <StatusItem 
                label="Up" 
                count={stats.upMonitors} 
                icon={<CheckCircle size={20} className="text-green-500" />}
                color="green"
              />
              <StatusItem 
                label="Down" 
                count={stats.downMonitors} 
                icon={<XCircle size={20} className="text-red-500" />}
                color="red"
              />
              <StatusItem 
                label="Pending" 
                count={stats.pendingMonitors} 
                icon={<Clock size={20} className="text-yellow-500" />}
                color="yellow"
              />
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-300">
                    Monitors Status
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div style={{ width: `${(stats.upMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"></div>
                <div style={{ width: `${(stats.downMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"></div>
                <div style={{ width: `${(stats.pendingMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500"></div>
              </div>
            </div>
          </div>
          
          {recentIncidents.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Incidents
                </h3>
                {recentIncidents.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    {recentIncidents.length} {recentIncidents.length === 1 ? 'monitor' : 'monitor'}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {recentIncidents.map(monitor => (
                  <div key={monitor.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{monitor.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{monitor.url}</p>
                      </div>
                      <MonitorStatusBadge status={monitor.currentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Latest Monitors
            </h3>
            
            {monitor.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-4">
                No monitor added yet
              </p>
            ) : (
              <div className="space-y-4">
                {monitor.slice(0, 3).map((monitor,index) => (
                  <div key={monitor.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white truncate max-w-[180px]">{monitor.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[180px]">{monitor.url}</p>
                      </div>
                      <MonitorStatusBadge status={monitor.currentStatus} />
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">
                        {monitor.history[index].responseTime ? `${monitor.history[index].responseTime}ms` : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};






export default Dashboard;