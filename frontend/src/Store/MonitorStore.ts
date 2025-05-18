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
    monitor:Monitor[]
    error:string|null
    getMonitors:(token:string|null)=>Promise<void>
    addMonitors:(payload:MonitorPost,token:string)=>Promise<Boolean>
}

export const useMonitor=create<MonitorStoreState>((set,get)=>({
    loading:false,
    monitor:[],
    error:null,
    getMonitors:async(token)=>{
     try {
        if(!token) return;
        set({loading:true,error:null})
      
         const url=import.meta.env.VITE_BACKEND_URL
         
        const resp=await axios.get(`${url}/monitor`,{
            headers:{
              
                "Authorization":`Bearer ${token}`,
                  "ngrok-skip-browser-warning": "69420" 
            }
        })

        set({loading:false,monitor:resp.data?.message})
    //        if (Array.isArray(resp.data)) {
    //   set({ loading: false, monitor: resp.data });
    // } else {
    //   console.error("Expected array, got:", resp.data);
    //   set({ loading: false, error: "Invalid monitor response" });
    // }
        

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
        await get().getMonitors(token)
        return true;
     } catch (error:any) {
        set({loading:false,error:error})
        console.log(error)
        return false;
     }
    }
}))