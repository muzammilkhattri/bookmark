"use client";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import BookmarkInput from "@/components/bookmark-input";
import BookmarkList from "@/components/bookmark-list";
import { useState } from "react";
export default function Page() {
  const [update, setUpdate] = useState(0);
  return (
    <div className="flex flex-col items-center">
      <BookmarkInput update={update} setUpdate={setUpdate} />
      <BookmarkList update={update} />
    </div>
  );
}
