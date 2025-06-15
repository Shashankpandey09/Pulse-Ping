
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { GetSocket } from "../utils/singletonWebsocket";
import { useToken } from "../hooks/getToken";


export default function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useUser();
  const {token}=useToken()
  useEffect(()=>{
    if(!token) return;
    const socket=GetSocket(token)
    return ()=>{
    socket.close()
    }
  },[token])

  if (!isLoaded) return null;
  if (!isSignedIn) return <RedirectToSignIn />;

  return <Outlet/>;
}
