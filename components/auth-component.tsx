"use client";
import { Button } from "./ui/button";
import { Icons } from "./icon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export function SignIn() {
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <Button variant="outline">
        <Icons.google className="mr-2 h-4 w-4" />
        Sign In With Google
      </Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  const supabase = createClientComponentClient();

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signOut();
  };
  return (
    <form
      onSubmit={(e) => {
        handleLogout(e);
      }}
      className="w-full"
    >
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
