import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Bookmark from "./bookmark";
import { Separator } from "./ui/separator";
export default async function BookmarkList() {
  const supabase = createServerComponentClient({ cookies });
  const user = await supabase.auth.getUser();
  const id_user = user.data.user?.id;
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("id_user", id_user);
  return (
    <div className="mx-4">
      <div className="flex justify-between mt-10 text-sm text-gray-500">
        <p>Title</p>
        <p>Created At</p>
      </div>
      <Separator className="my-4" />

      <div className="flex flex-col max-w-2xl">
        {bookmarks?.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
