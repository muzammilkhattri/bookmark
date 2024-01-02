"use client";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function BookmarkInput() {
  const searchParams = useSearchParams();

  const [link, setLink] = useState(searchParams.get("query")?.toString());
  const [id_user, setIDUser] = useState("");
  const { replace } = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  useEffect(() => {
    const getUserID = async () => {
      const user = await supabase.auth.getUser();
      setIDUser(user.data?.user?.id as string);
    };
    getUserID();
  }, []);

  useHotkeys([
    ["ctrl+f", () => document.getElementById("input-data")?.focus()],
  ]);

  const searchQuery = async (value: string) => {
    setLink(value);
    if (value.includes("http://") || value.includes("https://")) {
      console.log("URL");
    } else {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
    }
  };
  const promise = () =>
    new Promise((resolve) =>
      BookMarkQuery().then(() => resolve({ name: "Bookmark Created" }))
    );
  const CreateBookmark = async () => {
    toast.promise(promise, {
      loading: "Creating...",
      success: (data) => {
        return `${data.name}`;
      },
      error: "Error",
    });

    setLink("");
  };
  const BookMarkQuery = async () => {
    let name = await fetchTitle();
    console.log("Tite", name);
    const { data: create, error } = await supabase.from("bookmarks").insert([
      {
        name: name,
        data: link,
        id_user: id_user,
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
      <PlusIcon className="h-5 w-[5%]" />
      <Input
        placeholder="Insert a link, color, or just plain text"
        className="w-[89%] border-none shadow-none focus-visible:ring-0"
        onChange={(e) => searchQuery(e.target.value)}
        value={link}
        id="input-data"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            CreateBookmark();
          }
        }}
      />
      <div className="flex items-center justify-center w-[6%] bg-gray-100  p-1 rounded-md">
        <Command size="14" />
        <p>F</p>
      </div>
    </div>
  );
}
