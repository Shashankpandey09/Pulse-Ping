import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import axios from "axios";

const monitorRoute = Router();
monitorRoute.use(requireAuth());

const monitorSchema = z.object({
  name: z.string().min(1),
  url: z.string().url("Enter a valid URL"),
  interval: z.number().min(6000 * 10),
});

monitorRoute.post("/ping", async (req, res) => {
  try {
    const parsed = monitorSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(parsed.error.issues);
      res.status(400).json({ message: parsed.error.issues });
      return
    }

    const { userId } = getAuth(req);
    if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
       return
    }

    const monitor = await prisma.monitor.create({
      data: {
        userId,
        name: req.body.name,
        url: req.body.url,
        interval: req.body.interval,
      },
    });

    if (!monitor) {
       res.status(500).json({ message: "Creating monitor failed" });
       return
    }

    try {
      const startTime = Date.now();
      const resp = await axios.get(req.body.url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      const status = resp.status >= 200 && resp.status < 300 ? "UP" : "DOWN";

      const history = await prisma.history.create({
        data: {
          monitorId: monitor.id,
          lastStatus: status,
          responseTime,
        },
        include: { monitor: true },
      });

      res.status(201).json({ message: "Monitor created", monitor: history });
      return 
    } catch (err) {
      const history = await prisma.history.create({
        data: {
          monitorId: monitor.id,
          lastStatus: "DOWN",
          responseTime: 0,
        },
        include: { monitor: true },
      });

       res.status(500).json({ message: "Ping failed", monitor: history });
       return
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
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

export default monitorRoute;
