import { Router } from "express";
import nodeCron from "node-cron"
const pingRouter=Router()
 const job=nodeCron.schedule("* * * * * *",()=>{
    console.log("hi");
})
job.start();
export default pingRouter