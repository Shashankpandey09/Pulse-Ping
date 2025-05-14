interface StatusItemProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'yellow';
}

export const StatusItem: React.FC<StatusItemProps> = ({ label, count, icon, color }) => {
  const getBgColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className={`rounded-xl p-4 ${getBgColor()} transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </span>
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {count}
        </span>
      </div>
    </div>
  );
};
