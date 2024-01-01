"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Bookmarks from "./bookmarks";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
export default function BookmarkList() {
  const supabase = createClientComponentClient();
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const user = await supabase.auth.getUser();
      const id_user = user.data.user?.id;

      const { data: bookmarksData, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("id_user", id_user)
        .order("created_at", { ascending: false });
      setBookmarks(bookmarksData);
    };

    fetchData();
    // those are props values that used inside `obtenerTasks`
    // when those changes, this useeffect will rerun
  }, [bookmarks]);

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
