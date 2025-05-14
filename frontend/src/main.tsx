import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.tsx";

const Clerk_Publishable_Key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;
if (!Clerk_Publishable_Key) throw new Error("CLERK-PUBLISHABLE-KEY IS MISSING");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={Clerk_Publishable_Key}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
