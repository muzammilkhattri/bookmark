"use client";
import { Button } from "./ui/button";
import { Icons } from "./icon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import SpinnerAnimation from "./spinner";
export function SignIn() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return loading ? (
    <Button variant="outline" className="w-full" onClick={handleLogin} disabled>
      <SpinnerAnimation />
      <Icons.google className="mr-2 h-4 w-4" />
      Sign In With Google
    </Button>
  ) : (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      {" "}
      <Icons.google className="mr-2 h-4 w-4" />
      Sign In With Google
    </Button>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <Link href="" onClick={handleLogout}>
      Logout
    </Link>
  );
}
