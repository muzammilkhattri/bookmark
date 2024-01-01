import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Bookmarks from "./bookmarks";
import { Separator } from "./ui/separator";
export default async function BookmarkList() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  const id_user = user.data.user?.id;
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("id_user", id_user)
    .order("created_at", { ascending: false });
  // beign able to navigate the bookmarks element with the arrow keys
  return (
    <div className="mx-4 max-w-2xl w-full">
      <div className="flex justify-between mt-10 text-sm text-gray-500">
        <p>Title</p>
        <p>Created At</p>
      </div>
      <Separator className="my-4" />
      <Bookmarks bookmarks={bookmarks} />
    </div>
  );
}
