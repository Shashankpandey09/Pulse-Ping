
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <RedirectToSignIn />;

  return <>{children}</>;
}
