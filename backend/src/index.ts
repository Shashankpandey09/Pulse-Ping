import express from "express";
import { Ngrok } from "./middlewares/ngrok";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import clerkWebhookRouter from './routes/Register';
import monitorRoute  from "./routes/Monitor";



const app = express();
dotenv.config();

// 1. Apply CORS first
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET','DELETE'],
  allowedHeaders: ['svix-id', 'svix-timestamp', 'svix-signature', 'content-type']
}));

// 2. Webhook route - NO JSON PARSING HERE
app.use('/clerk-webhook', clerkWebhookRouter);

// 3. Apply JSON parsing for other routes
app.use(express.json());

// 4. Clerk authentication (only for non-webhook routes)
app.use(clerkMiddleware());

// 5. Regular routes
app.get('/', (req, res) => {
  
  res.send("hello")
 return;
});


app.use('/monitor',monitorRoute)

app.listen(process.env.PORT, async () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
  await Ngrok();
});