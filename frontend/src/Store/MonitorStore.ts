import {create} from 'zustand'
import axios from 'axios'
import { useAuth } from "@clerk/clerk-react";
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
interface MonitorStoreState{
    loading:boolean,
    monitor:Monitor[]
    error:string|null
    getMonitors:()=>Promise<void>
}

export const useMonitor=create<MonitorStoreState>((set)=>({
    loading:false,
    monitor:[],
    error:null,
    getMonitors:async()=>{
     try {
        const { getToken } = useAuth(); 
        set({loading:true,error:null})
        const token=await getToken()

        const resp=await axios.get<Monitor[]>('http://localhost:3000/monitor',{
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
        set({loading:false,monitor:resp.data})

     } catch (error) {
        set({loading:false,error:(error) as string})
     }
    }
}))