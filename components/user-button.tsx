import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "./auth-component";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import GroupSwitcher from "./group-switcher";
export default async function UserButton() {
  const supabase = createServerComponentClient({ cookies });

  const { data: session } = await supabase.auth.getUser();
  if (!session?.user) return <Link href="/login">Login</Link>;
  return (
    <div className="flex items-center justify-center">
      <GroupSwitcher className="mr-2" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-7 h-7">
              {session.user.user_metadata.avatar_url && (
                <AvatarImage
                  src={`https://avatar.vercel.sh/${encodeURI(
                    session.user.user_metadata.name?.replace(/[^a-zA-Z ]/g, "")
                  )}.png`}
                  alt={session.user.user_metadata.name ?? ""}
                />
              )}
              <AvatarFallback>{session.user.user_metadata.name}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.user_metadata.name}
              </p>
              <p className="text-xs font-medium leading-none">
                {session.user.user_metadata.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
