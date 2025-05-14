import { Webhook } from "svix";
import { RequestHandler } from "express";

declare module "express" {
  interface Request {
    clerkPayload?: Record<string, any>;
    rawBody?: Buffer;
  }
}

export const clerkWebHook: RequestHandler = (req, res, next) => {
  try {
    // Validate headers
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!CLERK_WEBHOOK_SECRET) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }

    const payload = req.body; // Buffer
    const payloadString = payload.toString("utf8");
    // Validating raw body
    if (!payloadString) {
      res.status(400).json({ error: "Missing raw body" });
      return;
    }

    const webhook = new Webhook(CLERK_WEBHOOK_SECRET);
    const payloads = webhook.verify(payloadString, {
      "svix-id": `${svixId}`,
      "svix-timestamp": `${svixTimestamp}`,
      "svix-signature": `${svixSignature}`,
    }) as Record<string, any>;

    // Attach verified payload
    req.clerkPayload = payloads;
    next();
  } catch (error) {
    console.error("Webhook verification failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(401).json({ error: `Invalid signature: ${message}` });
  }
};
