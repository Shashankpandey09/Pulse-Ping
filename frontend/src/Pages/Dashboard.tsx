import React, { useMemo } from 'react';
import { Clock, Activity, CheckCircle, XCircle } from 'lucide-react';
import MonitorStatusBadge from '../Components/MonitorStatusBadge';
import { StatCard } from '../Components/StatCard';
import { StatusItem } from '../Components/StatusItem';
import { useMonitor } from '../Store/MonitorStore';
import Nav from '../Components/Nav';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '@clerk/clerk-react';

const Dashboard: React.FC = () => {
  const { getMonitors, monitors } = useMonitor();
  const {getToken}=useAuth();
  const token=getToken();

  const stats = useMemo(() => {
    const totalMonitors = monitors.length;
    const upMonitors = monitors.filter(m => m.currentStatus === 'up').length;
    const downMonitors = monitors.filter(m => m.currentStatus === 'down').length;
    const pendingMonitors = monitors.filter(m => m.currentStatus === 'pending').length;

    const totalChecks = monitors.reduce((sum, m) => sum + m.history.length, 0);
    const upChecks = monitors.reduce(
      (sum, m) => sum + m.history.filter(h => h.lastStatus === 'up').length,
      0
    );

    const uptimePercentage = totalChecks > 0
      ? (upChecks / totalChecks * 100).toFixed(2)
      : '0.00';

    const responseTimes = monitors.flatMap(m =>
      m.history
        .filter(h => m.currentStatus === 'up' && h.responseTime !== null)
        .map(h => h.responseTime as number)
    );

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
  }, [monitors]);

  const recentIncidents = useMemo(() => {
  const downMonitors = monitors
  .filter(m => m.history.some(entry => entry.lastStatus === 'down'))
  .slice(0, 3);

    return downMonitors.slice(0, 3);
  }, [monitors]);

  return (
    <div className="relative min-h-screen  bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      <Nav />
      <Sidebar/>
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16">
        <h2 className="text-3xl font-bold mb-8 font-mono">Dashboard</h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            change={stats.downMonitors > 0 ? `+${stats.downMonitors}` : '0'}
            changeType={stats.downMonitors > 0 ? 'negative' : 'positive'}
          />
        </div>

        {/* Status and Incident Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Overview */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-[#404040] to-[#1c1b1b] text-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 ">
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

              {/* Progress Bar */}
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${(stats.upMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }}
                  className="bg-green-500 transition-all duration-500"
                />
                <div
                  style={{ width: `${(stats.downMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }}
                  className="bg-red-500 transition-all duration-500"
                />
                <div
                  style={{ width: `${(stats.pendingMonitors / Math.max(stats.totalMonitors, 1)) * 100}%` }}
                  className="bg-yellow-500 transition-all duration-500"
                />
              </div>
            </div>

            
            {recentIncidents.length > 0 && (
              <div className="shadow-lg p-6">
                <div className="flex items-center justify-between bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] mb-4">
                  <h3 className="text-xl font-semibold text-white ">
                    Recent Incidents
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    {recentIncidents.length} {recentIncidents.length === 1 ? 'monitors' : 'monitors'}
                  </span>
                </div>

                <div className="space-y-4">
                  {recentIncidents.map(m => (
                    <div key={m.id} className="border-l-4 border-red-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{m.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{m.url}</p>
                        </div>
                        <MonitorStatusBadge status={m.currentStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

         
          <div>
            <div className="bg-gradient-to-b from-[#0f0f0f] to-[#3b3b3b] rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white dark:text-white">
                Latest Monitors
              </h3>

              {monitors.length === 0 ? (
                <p className="text-green-500 dark:text-gray-300 text-center py-4">
                  No monitors added yet
                </p>
              ) : (
                <div className="space-y-4">
                  {monitors.slice(0, 3).map(m => (
                    <div key={m.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white truncate max-w-[180px]">
                            {m.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[180px]">
                            {m.url}
                          </p>
                        </div>
                        <MonitorStatusBadge status={m.currentStatus} />
                      </div>

                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">
                          {m.history.length > 0 && m.history[m.history.length - 1].responseTime
                            ? `${m.history[m.history.length - 1].responseTime}ms`
                            : 'N/A'}
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
