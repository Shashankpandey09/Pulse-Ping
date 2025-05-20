import { useEffect } from "react"
import MonitorGraph from "../Components/MonitorHistoryGraph"
import { useMonitor } from "../Store/MonitorStore"
import { useToken } from "../hooks/getToken"
import { useParams } from "react-router-dom"
const HistoryGraph = () => {
    const {getHistory,history,monitor}=useMonitor()
    const {token}=useToken()
    const {id}=useParams()
    const filteredMonitor=monitor.find((m)=>m.id==Number(id))
    useEffect(()=>{
        getHistory(token,Number(id))
    },[token])
  return (
    <div className=" h-full flex  items-center w-full"><MonitorGraph history={history} monitor={filteredMonitor}/></div>
  )
}
export default HistoryGraph