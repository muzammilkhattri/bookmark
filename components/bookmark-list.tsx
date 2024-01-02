import Bookmarks from "./bookmarks";
import { Separator } from "./ui/separator";
import { Bookmark } from "@/types/bookmark";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function BookmarkList() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  const id_user = user.data.user?.id;
  const { data: bookmarksData, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("id_user", id_user)
    .order("created_at", { ascending: false });
  return (
    <div className="mx-4 max-w-2xl w-full">
      <div className="flex justify-between mt-10 text-sm text-gray-500">
        <p>Title</p>
        <p>Created At</p>
      </div>
      <Separator className="my-4" />
      <Bookmarks serverBookmarks={bookmarksData as Bookmark[]} />
    </div>
  );
}
