"use client";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { Command } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import { useDebouncedCallback } from "use-debounce";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { fetchTitle } from "@/lib/utils";

export default function BookmarkInput({ id_user }: { id_user: string }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const [link, setLink] = useState(searchParams.get("query")?.toString());

  useHotkeys([
    ["ctrl+f", () => document.getElementById("input-data")?.focus()],
  ]);

  const searchQuery = useDebouncedCallback((value: string) => {
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
  }, 300);

  const createBookmark = async () => {
    toast.promise(
      (async () => {
        try {
          const name = await fetchTitle(link as string);
          console.log("Title", name);

          const { data, error } = await supabase.from("bookmarks").insert([
            {
              name: name,
              data: link,
              id_user: id_user,
            },
          ]);

          if (error) {
            throw new Error("Bookmark creation failed");
          }

          return { name: "Bookmark Created" };
        } catch (error) {
          console.error("Error creating bookmark:", error);
          throw error;
        } finally {
          setLink("");
        }
      })(),
      {
        loading: "Creating...",
        success: (data) => {
          return `${data.name}`;
        },
        error: "Error Error",
      }
    );
  };

  return (
    <div className="max-w-2xl bg-white w-full flex items-center shadow-sm border-2 p-2 rounded-md ring-gray-400 border-gray focus-within:ring-2">
      <PlusIcon
        className="h-5 w-[5%] cursor-pointer"
        onClick={createBookmark}
      />
      <Input
        placeholder="Insert a link, color, or just plain text"
        className="w-[89%] border-none shadow-none focus-visible:ring-0"
        onChange={(e) => {
          setLink(e.target.value);
          searchQuery(e.target.value);
        }}
        value={link}
        id="input-data"
        onKeyDown={(e) => {
          console.log(e.key);
          if (e.key === "Enter") {
            createBookmark();
          }
        }}
      />
      <div className="flex items-center justify-center w-[6%] bg-gray-100  p-1 rounded-md">
        <Command className="mr-1" size="14" />
        <p>F</p>
      </div>
    </div>
  );
}
