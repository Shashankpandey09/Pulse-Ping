import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface MonitorStatusBadgeProps {
  status: string|null;
}

const MonitorStatusBadge: React.FC<MonitorStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'up':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-400',
          icon: <CheckCircle size={16} className="mr-1" />,
          label: 'Up'
        };
      case 'down':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-400',
          icon: <XCircle size={16} className="mr-1" />,
          label: 'Down'
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          icon: <Clock size={16} className="mr-1" />,
          label: 'Pending'
        };
      default:
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-700',
          textColor: 'text-gray-800 dark:text-gray-400',
          icon: <Clock size={16} className="mr-1" />,
          label: 'Unknown'
        };
    }
  };

  const { bgColor, textColor, icon, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

export default MonitorStatusBadge;