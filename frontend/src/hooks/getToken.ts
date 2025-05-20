import { useAuth } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";

export const useToken=()=>{
     const [token,setToken]=useState<string|null>(null)
    const {getToken}=useAuth()
   useEffect(()=>{
    const getTok=async()=>{
    
        const token=await getToken();
        setToken(token);
    
    }
    getTok();
   },[])
 

   return useMemo(() => ({token}), [token]); 
}