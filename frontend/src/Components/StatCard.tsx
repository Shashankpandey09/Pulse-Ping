import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  change,
  changeType = 'neutral'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'green': return 'bg-green-50 dark:bg-green-900/20';
      case 'red': return 'bg-red-50 dark:bg-red-900/20';
      case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'purple': return 'bg-purple-50 dark:bg-purple-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${getColorClass()}`}>
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : changeType === 'negative' ? (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          ) : (
            <span className="h-4 w-4" />
          )}
          <p 
            className={`text-sm ml-1 ${
              changeType === 'positive' 
                ? 'text-green-600 dark:text-green-400' 
                : changeType === 'negative' 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {change} from previous period
          </p>
        </div>
      )}
    </div>
  );
};
