import { useEffect } from "react"
import { useMonitor } from "../Store/MonitorStore"
import MonitorCard from "../Components/MonitorCard"
import Nav from "../Components/Nav"
import Sidebar from "../Components/Sidebar"
import { useToken } from "../hooks/getToken"
import MonitorCardSkeleton from "../Components/MonitorCardSkeleton"

const Monitors = () => {
    const {getMonitors,monitor,loading}=useMonitor();
    const {token,load}=useToken()
     console.log(monitor,token)
  
useEffect(()=>{
  if(token && !monitor.length)
   getMonitors(token) 
},[token])
  
  //    const monitors = [
  //   { name: "Google", url: "https://google.com", interval: 5, currentStatus: "up" },
  //   { name: "My API", url: "https://myapi.com", interval: 30, currentStatus: "down" },
  //   { name: "Docs", url: "https://docs.myapp.com", interval: 59, currentStatus: "up" },
  // ];
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
        <Nav/>
        <Sidebar/>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
   
  {loading ? (
  < >
    {Array.from({ length: 5 }).map((_, i) => (
      <MonitorCardSkeleton key={`skeleton-${i}`} />
    ))}
  </>
) : monitor?.length ? (
  <>
    {monitor.map((m) => (
      <MonitorCard key={m.id} {...m} />
    ))}
  </>
) : (
  <div className="col-span-full text-center py-12 text-gray-400">
    No monitors found. Create your first monitor to get started.
  </div>
)}
      
    </div>
    </div>
  )
}
export default Monitors