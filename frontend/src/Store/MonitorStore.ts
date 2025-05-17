import {create} from 'zustand'
import axios from 'axios'

 type Monitor={
      name: string;
    url: string;
    interval: number;
    userId: string;
    id: number;
    currentStatus: string | null;
    createdAt: Date;
    history:history[]
}

type history={
     id: number;
    monitorId: number;
    lastStatus: string;
    lastPing: Date;
    responseTime: number | null;
}
type MonitorPost=Pick<Monitor,"name" | "url"| "interval">
interface MonitorStoreState{
    loading:boolean,
    monitors:Monitor[]
    error:string|null
    getMonitors:(token:string)=>Promise<void>
    addMonitors:(payload:MonitorPost,token:string)=>Promise<Boolean>
}

export const useMonitor=create<MonitorStoreState>((set)=>({
    loading:false,
    monitors:[],
    error:null,
    getMonitors:async(token)=>{
     try {
       
        set({loading:true,error:null})
      

        const resp=await axios.get<Monitor[]>(`${import.meta.env.VITE_BACKEND_URL}/monitor`,{
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        set({loading:false,monitors:resp.data})

     } catch (error) {
        set({loading:false,error:(error) as string})
     }
    },
    addMonitors:async(payload,token)=>{
     try {
   
        
        set({loading:true});
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/monitor/create`,payload,{
          headers:{
            "Content-Type":'application/json',
            "Authorization":`Bearer ${token}`
          }
        })
        set({loading:false}) 
        return true;
     } catch (error:any) {
        set({loading:false,error:error})
        console.log(error)
        return false;
     }
    }
}))