import { useEffect } from "react"
import { useMonitor } from "../Store/MonitorStore"
import MonitorCard from "../Components/MonitorCard"
import Nav from "../Components/Nav"
import Sidebar from "../Components/Sidebar"

const Monitors = () => {
    // const {getMonitors,monitor}=useMonitor()
    // useEffect(()=>{
    //     getMonitors();
    // },[monitor])
     const monitors = [
    { name: "Google", url: "https://google.com", interval: 5, currentStatus: "up" },
    { name: "My API", url: "https://myapi.com", interval: 30, currentStatus: "down" },
    { name: "Docs", url: "https://docs.myapp.com", interval: 59, currentStatus: "up" },
  ];
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
        <Nav/>
        <Sidebar/>
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
   
      {monitors.map((m, i) => (
        <MonitorCard key={i} {...m} />
      ))}
    </div>
    </div>
  )
}
export default Monitors