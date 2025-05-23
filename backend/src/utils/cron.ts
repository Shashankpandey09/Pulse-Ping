import nodeCron, { ScheduledTask } from 'node-cron'
import { Monitor } from "@prisma/client";
import { ScheduleJobs } from './ping.job';
//cookie jar setuo
const cookieJar=new Map<number,{job:ScheduledTask,monitors:Monitor[]}>();
//adding monitors to the jar
export const addMonitorsTojar=(monitor:Monitor)=>{
const jar=cookieJar.get(monitor.interval);
if(jar){
    //adding monitors to the jar if the jar already exist 
    jar.monitors.push(monitor)
}
else{
    //creating a new jar with cron jobs
    const cronExp=`*/${monitor.interval} * * * *`;
    const job=nodeCron.schedule(cronExp,()=>{
     // get current jar
     const currentJar=cookieJar.get(monitor.interval)!;
     ScheduleJobs(currentJar.monitors)
    })
    cookieJar.set(monitor.interval, {
        job,
        monitors: [monitor]
      });
}
}

export const removeCookiesFromJar=(monitor:Monitor)=>{
    for(const [interval,jar] of cookieJar){
        const monitorIndex=jar.monitors.findIndex((c)=>c.id===monitor.id)
        if(monitorIndex!==-1){
            //removing monitor from list 
            jar.monitors.splice(monitorIndex,1);
            //checking if the jar container is empty if yes 
            //we will stop the cron jobs
            if(jar.monitors.length==0){
                jar.job.stop()
                cookieJar.delete(interval);
            }
            break;
        }
      
    }
}