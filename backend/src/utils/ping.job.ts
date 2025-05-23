import { Monitor } from "@prisma/client";
import { prisma } from "../lib/prisma";
import axios from "axios";
import { sendDownAlert } from "./SentDownEmail";
import { checkUrl } from "./checkUrl";


// create a function  to schedule the jobs and set and clear it
export const ScheduleJobs = async(monitors:Monitor[]) => {
  if(monitors.length==0) return;
  await Promise.all(
    monitors.map(async (monitor) => {
      try {
     const response=await checkUrl(monitor.url)
  
        // Get previous status first
        const previousStatus = monitor.currentStatus;
  
        // Transaction for atomic updates
        const [history, updatedMonitor] = await prisma.$transaction([
          prisma.history.create({
            data: {
              lastStatus: response.status,
              responseTime: response.responseTime,
              monitorId: monitor.id,
            },
          }),
          prisma.monitor.update({
            where: { id: monitor.id },
            data: {
              currentStatus: response.status
            },
            include: { user: true }
          }),
        ]);
  
        // Alert only if status changed to DOWN
        if (updatedMonitor.currentStatus == previousStatus && 
            updatedMonitor.currentStatus === "down") {
          await sendDownAlert(monitor.name, monitor.url, updatedMonitor.user.email);
        }
  
      } catch (error) {
        // Similar transaction for error case
        const [history, updatedMonitor] = await prisma.$transaction([
          prisma.history.create({
            data: { lastStatus: "down", monitorId: monitor.id },
          }),
          prisma.monitor.update({
            where: { id: monitor.id },
            data: { currentStatus: "down" },
            include: { user: true }
          }),
        ]);
        
        await sendDownAlert(monitor.name, monitor.url, updatedMonitor.user.email);
      }
    })
  );
   

};

//based on the interval from monitor i wanna start cron job for
//critical,mid and othe
