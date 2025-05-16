import { ArrowUpRight } from "lucide-react"

type MonitorCard={
    name:string,
    url:string,
    interval:number,
    currentStatus:string|null
}
const MonitorCard = ({name,url,interval,currentStatus}:MonitorCard) => {
    const getIntervalLabel=()=>{
        if(interval==5) return "critical (checks every 5 min)"
          if(interval==30) return "critical (checks every 30 min)"
            if(interval==59) return "critical (checks every 59 min)"
    }
  return (
   <div className=" cursor-pointer rounded-2xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-xl p-4 w-full transition-all hover:border-cyan-400 group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold text-lg">{name}</h3>
        <div className="flex gap-3 items-center">
              <a className="text-white hover:scale-125 transition-scale ease-in-out duration-300" href={url}><ArrowUpRight className="w-5 h-5"/></a>
                <span
          className={`w-3 h-3 rounded-full ${
            currentStatus=== "down" ? "bg-red-400 animate-pulse" : "bg-green-400"
          }`}
          
        />
        </div>
      
      
      </div>

      <p className="text-gray-400 text-sm truncate">{url}</p>

      <div className="mt-4 text-sm text-cyan-300">
        {getIntervalLabel()}
      </div>
    </div>
  )
}
export default MonitorCard