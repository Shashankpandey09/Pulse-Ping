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
      case 'blue': return 'bg-blue-600/20 text-blue-400';
      case 'green': return 'bg-green-600/20 text-green-400';
      case 'red': return 'bg-red-600/20 text-red-400';
      case 'yellow': return 'bg-yellow-600/20 text-yellow-400';
      case 'purple': return 'bg-purple-600/20 text-purple-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="bg-[#1c1c1e] border border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg transition hover:shadow-xl duration-200 ease-in-out">
      <div className="flex justify-between items-center text-white">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${getColorClass()}`}>
          {icon}
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center text-sm">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          ) : changeType === 'negative' ? (
            <ArrowDownRight className="h-4 w-4 text-red-400" />
          ) : (
            <span className="h-4 w-4" />
          )}
          <p className={`ml-2 ${
            changeType === 'positive'
              ? 'text-green-400'
              : changeType === 'negative'
                ? 'text-red-400'
                : 'text-gray-400'
          }`}>
            {change} from previous period
          </p>
        </div>
      )}
    </div>
  );
};
