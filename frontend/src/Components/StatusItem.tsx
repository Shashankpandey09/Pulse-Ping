interface StatusItemProps {
    label: string;
    count: number;
    icon: React.ReactNode;
    color: 'green' | 'red' | 'yellow';
  }
  
  export const StatusItem: React.FC<StatusItemProps> = ({ label, count, icon, color }) => {
    const getBgColor = () => {
      switch (color) {
        case 'green': return 'bg-green-50 dark:bg-green-900/20';
        case 'red': return 'bg-red-50 dark:bg-red-900/20';
        case 'yellow': return 'bg-yellow-50 dark:bg-yellow-900/20';
        default: return 'bg-gray-50 dark:bg-gray-800';
      }
    };
  
    return (
      <div className={`rounded-lg p-4 ${getBgColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{label}</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{count}</span>
        </div>
      </div>
    );
  };