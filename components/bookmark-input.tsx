"use client";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { Command } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { create } from "domain";
import { title } from "process";
export default function BookmarkInput() {
  const [link, setLink] = useState("");
  const supabase = createClientComponentClient();
  useHotkeys([
    ["ctrl+f", () => document.getElementById("input-data")?.focus()],
  ]);
  const promise = () =>
    new Promise((resolve) =>
      BookMarkQuery().then(() => resolve({ message: "Bookmark Created" }))
    );
  const CreateBookmark = async () => {
    toast.promise(promise, {
      loading: "Creating...",
      success: (data) => {
        return `${data.message}`;
      },
      error: "Error",
    });

    setLink("");
  };
  const BookMarkQuery = async () => {
    const user = await supabase.auth.getUser();
    let name = await fetchTitle();
    console.log("Tite", name);
    const { data: create, error } = await supabase.from("bookmarks").insert([
      {
        name: name,
        data: link,
        id_user: user.data.user?.id,
      },
    ]);
  };
  const fetchTitle = async () => {
    try {
      const response = await axios.post("/api/fetch-title", {
        url: link,
      });
      return response.data.title;
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  };

  return (
    <div className="max-w-2xl w-full flex items-center shadow-sm border-2 p-2 rounded-md ring-gray-400 border-gray focus-within:ring-2">
      <PlusIcon className="h-6 w-[5%]" />
      <Input
        placeholder="Insert a link, color, or just plain text"
        className="w-[89%] border-none shadow-none focus-visible:ring-0"
        onChange={(e) => setLink(e.target.value)}
        value={link}
        id="input-data"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            CreateBookmark();
          }
        }}
      />
      <div className="flex items-center w-[6%] bg-gray-100  p-1 rounded-md">
        <Command size="18" />
        <p>F</p>
      </div>
    </div>
  );
}
