"use client";
import { Button } from "./ui/button";
import { Icons } from "./icon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      <Button variant="outline" className="w-full">
        <Icons.google className="mr-2 h-4 w-4" />
        Sign In With Google
      </Button>
    </form>
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
