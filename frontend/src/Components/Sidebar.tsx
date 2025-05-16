import { FiHome, FiPlus, FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {
  const navigate=useNavigate()
  return (
    <div className={`fixed z-50
    
      left-4 top-[50%] -translate-y-[50%] 
      
      max-md:fixed max-md:bottom-4 max-md:right-4 max-md:top-auto max-md:left-auto max-md:translate-y-0
      
      bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl 
      transition-all duration-300 ease-out
   
      w-14 rounded-full
      max-md:w-auto max-md:px-2 max-md:rounded-full`}
    >
      <div className="flex flex-col items-center space-y-3 p-2
                     max-md:flex-row max-md:space-y-0 max-md:space-x-2">
        {/* Home Button */}
        <button  onClick={()=>navigate('/dashboard')} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors duration-200">
          <FiHome className="h-6 w-6 text-gray-300" />
        </button>

        {/* Plus Button */}
        <button onClick={()=>navigate('/addMonitor')}  className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors duration-200">
          <FiPlus className="h-6 w-6 text-gray-300" />
        </button>

        {/* Monitor Button */}
        <button onClick={()=>navigate('/Monitors')} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors duration-200">
          <FiMonitor className="h-6 w-6 text-gray-300" />
        </button>
      </div>
    </div>
  );
}