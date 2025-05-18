import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";

export const useToken=()=>{
     const [token,setToken]=useState<string|null>(null)
     const [load,setloading]=useState(false)
    const {getToken}=useAuth()
   useEffect(()=>{
    const getTok=async()=>{
        setloading(true)
        const token=await getToken();
        setToken(token);
        setloading(false)
    }
    getTok();
   },[])
 

   return useMemo(() => ({token,load}), [token]); 
}