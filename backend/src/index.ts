import express from "express";
// import { Ngrok } from "./middlewares/ngrok";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import clerkWebhookRouter from './routes/Register';
import monitorRoute from "./routes/Monitor";

const app = express();
dotenv.config();

// 1. Apply CORS first
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization",  "ngrok-skip-browser-warning" ],
  credentials: false,
}));

// 2. Add ngrok bypass header HERE (before routes)
app.use((_req, res, next) => {
  res.header("ngrok-skip-browser-warning", "true");
  next();
});

// 3. Webhook route (no JSON parsing)
app.use('/clerk-webhook', clerkWebhookRouter);

// 4. JSON parsing for other routes
app.use(express.json());

// 5. Clerk authentication
app.use(clerkMiddleware());

// 6. Regular routes
app.use('/monitor', monitorRoute);
app.get('/', (req, res) => {
  res.send("hello");
});

app.listen(process.env.PORT,  () => {
  console.log(`Server running on port ${process.env.PORT || 3000} (bound to 0.0.0.0)`);
  // await Ngrok();
});