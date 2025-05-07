
import { Monitor } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {Request, Response ,NextFunction } from "express";
import { getAuth } from "@clerk/express";

interface ExtendedREQ extends Request {
    monitorGroups?:Map<number,Monitor[]>
}
//extracting global monitors
export const globalMonitors=async(req:ExtendedREQ,res:Response,next:NextFunction)=>{
    try {
        //extracting monitors
        const {userId}=getAuth(req)
        const monitors=await prisma.monitor.findMany({
            where:{userId:String(userId)}
        })
        if(monitors.length==0){
            req.monitorGroups=new Map<number,Monitor[]>()
            return next();
        }
        // categorize the grouped object on the basis of interval
        const grouped=monitors.reduce((acc,monitor)=>{
            const interval:number=monitor.interval
            acc.set(interval,[...(acc.get(interval)||[]),monitor]);
            return acc;
        },new Map<number,Monitor[]>())
        //setting it in the req body
        req.monitorGroups=grouped;
        next();
    } catch (error) {
        console.log('error',error);
      res.status(500).json({message:'failed to fetch',error:error})
    }
}