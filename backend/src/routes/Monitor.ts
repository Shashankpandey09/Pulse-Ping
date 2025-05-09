import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import axios from "axios";
import { addMonitorsTojar, removeCookiesFromJar } from "../utils/cron";

const monitorRoute = Router();
monitorRoute.use(requireAuth());

const monitorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url("Enter a valid URL"),
  interval: z.number().min(6000 * 10),
});

monitorRoute.post("/create", async (req, res) => {
  try {
    const parsed = monitorSchema.safeParse(req.body);
    if (!parsed.success) {
       res.status(400).json({ message: parsed.error.issues });
       return
    }

    const { userId } = getAuth(req);
    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    // Check existing monitor count
    const existingCount = await prisma.monitor.count({
      where: { userId },
    });

    if (existingCount >= 5) {
      res.status(403).json({
        message: "Maximum limit reached. You can only have 5 monitors.",
      });
      return ;
    }

    const monitor = await prisma.monitor.create({
      data: {
        userId,
        name: req.body.name,
        url: req.body.url,
        interval: req.body.interval,
      },
    });
    
    const startTime = Date.now();
    try {
      const response = await axios.get(req.body.url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      const status = response.status >= 200 && response.status < 300 ? "UP" : "DOWN";

      const history = await prisma.history.create({
        data: {
          monitorId: monitor.id,
          lastStatus: status,
          responseTime,
        },
        include: { monitor: true },
      });

     res.status(201).json({
        message: "Monitor created successfully",
        data: history,
      });
      addMonitorsTojar(monitor)
      return
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const history = await prisma.history.create({
        data: {
          monitorId: monitor.id,
          lastStatus: "DOWN",
          responseTime,
        },
        include: { monitor: true },
      });

       res.status(201).json({
        message: "Monitor created but initial check failed",
        data: history,
      });
      return
    }
  } catch (error) {
    console.error("❌ Error creating monitor:", error);
     res.status(500).json({ message: "Internal server error" });
     return
  }
});

monitorRoute.get('/',async(req,res)=>{
  // fetching clerk id from req
try {
 const {userId}=getAuth(req)
 if(!userId) {res.status(401).json({message:"unauthorized"})
 return;}
//getting all the monitors for the user
const monitors =await prisma.monitor.findMany({
 where:{userId:userId},
})
if(!monitors){
 res.status(404).json({message:'not found'})
 return
}
res.status(200).json({message:monitors})
return;
} catch (error) {
  res.status(500).json({error:`error is----> ${error}`})
}
})

monitorRoute.get('/history/:id',async(req,res)=>{
  try {
    // fetching the history for a specific monitor
    const id:number=Number(req.params.id)
    const monitorHistory=await prisma.history.findMany({
      where:{monitorId:id}
    })
    if(!monitorHistory) {
      res.status(404).json({message:"Not Found"});
      return;
    }
  } catch (error) {
    res.status(500).json({message:error})
  }
})
monitorRoute.delete('/delete/:id',async(req,res)=>{
  try {
    const id:number=Number(req.params.id)
    const [,deletedMonitor]=await prisma.$transaction([prisma.history.deleteMany({where:{monitorId:id}}),prisma.monitor.delete({where:{id:id}})])
    res.status(201).json({message:`deleted monitor with id ${deletedMonitor.id} and name ${deletedMonitor.name}`})
    removeCookiesFromJar(deletedMonitor);
    return;
  } catch (error) {
    res.status(500).json({error:error})
    return;
  }

})
export default monitorRoute;
