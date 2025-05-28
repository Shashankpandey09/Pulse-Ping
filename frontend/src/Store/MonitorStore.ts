import {create} from 'zustand'
import axios from 'axios'
import type { Monitor,history } from '../types/types'


 
type MonitorPost=Pick<Monitor,"name" | "url"| "interval">
interface MonitorStoreState{
    loading:boolean,
    monitor:Monitor[]
    error:string|null,
    history:history[]
    buttonLoad:boolean,
    getMonitors:(token:string|null)=>Promise<void>
    addMonitors:(payload:MonitorPost,token:string)=>Promise<Boolean>
    getHistory:(token:string|null,id:number)=>Promise<void>
}

export const useMonitor=create<MonitorStoreState>((set,get)=>({
    loading:true,
    monitor:[],
    error:null,
    history:[],
    buttonLoad:false,
    getMonitors:async(token)=>{
     try {
        if(!token) return;
       
        set({loading:true});
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
        console.log(error)
     }
    },
    addMonitors:async(payload,token)=>{
     try {
   
        
        set({buttonLoad:true});
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/monitor/create`,payload,{
          headers:{
            "Content-Type":'application/json',
            "Authorization":`Bearer ${token}`
          }
        })
        set({buttonLoad:false}) 
        await get().getMonitors(token)
        return true;
     } catch (error:any) {
        set({loading:false,error:error,buttonLoad:false})
        console.log(error)
        return false;
     }
    },
    getHistory:async(token,id)=>{
     try {
      if(!token) return;
      const url=import.meta.env.VITE_BACKEND_URL
      const resp=await axios.get(`${url}/monitor/history/${id}`,{
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${token}`,
           "ngrok-skip-browser-warning": "69420" 
        }
      })
     set({loading:false,history:resp.data.message})
     await get().getMonitors(token)
     console.log(id,history,token,url)
     } catch (error:any) {
     set({loading:false,error:error.message})
     }
    }
}))