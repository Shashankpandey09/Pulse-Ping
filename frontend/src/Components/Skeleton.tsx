import Nav from "./Nav";
import Sidebar from "./Sidebar";

export const SkeletonDashboard = () => (
  <div className="relative min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
    <Nav />
    <Sidebar />
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16 animate-pulse">
      <div className="h-10 bg-gray-800 rounded w-1/4 mb-8"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
        ))}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     
        <div className="lg:col-span-2 space-y-6">
          <div className="h-96 bg-gray-800 rounded-2xl p-6">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-2 bg-gray-700 rounded-full"></div>
          </div>
          
          <div className="h-64 bg-gray-800 rounded-2xl p-6"></div>
        </div>

        <div className="h-96 bg-gray-800 rounded-2xl p-6">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);