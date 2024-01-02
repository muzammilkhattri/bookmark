"use client";
import { Bookmark } from "@/types/bookmark";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useReducer } from "react";
import { toast } from "sonner";
import { Copy, Edit, Trash } from "lucide-react";
import { useKeyPress } from "../lib/useKeyPress";
import { formateDate, fetchDomain, openLink } from "../lib/bookmark-utils";
import { useHotkeys } from "@mantine/hooks";
const initialState = { selectedIndex: 0 };

export default function Bookmarks({
  serverBookmarks,
}: {
  serverBookmarks: Bookmark[];
}) {
  const [bookmarks, setBookmarks] = useState(serverBookmarks);
  const supabase = createClientComponentClient();

  useEffect(() => {
    setBookmarks(serverBookmarks);
  }, [serverBookmarks]);
  useHotkeys([
    [
      "ctrl+c",
      () => {
        const urlToCopy = document.getElementById(
          `bookmark-${state.selectedIndex}`
        )?.dataset.url;
        copyLink(urlToCopy);
      },
    ],
  ]);
  useEffect(() => {
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setBookmarks((bookmarks) =>
              bookmarks.filter((bookmark) => bookmark.id !== payload.old.id)
            );
          } else if (payload.eventType === "INSERT") {
            setBookmarks((bookmarks) => [
              payload.new as Bookmark,
              ...bookmarks,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setBookmarks, bookmarks]);
  const reducer = (state, action) => {
    switch (action.type) {
      case "arrowUp":
        document.getElementById(`bookmark-${state.selectedIndex - 1}`)?.focus();
        return {
          selectedIndex:
            state.selectedIndex !== 0
              ? state.selectedIndex - 1
              : bookmarks.length - 1,
        };
      case "arrowDown":
        document.getElementById(`bookmark-${state.selectedIndex + 1}`)?.focus();
        return {
          selectedIndex:
            state.selectedIndex !== bookmarks.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      case "select":
        document.getElementById(`bookmark-${action.payload}`)?.focus();
        return { selectedIndex: action.payload };
      default:
        throw new Error();
    }
  };
  const deleteBookmark = async (id: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .match({ id: id });
    toast.success("Bookmark Deleted");
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link Copied");
  };
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (arrowUpPressed) {
      dispatch({ type: "arrowUp" });
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      dispatch({ type: "arrowDown" });
    }
  }, [arrowDownPressed]);
  // show the month and date only form timestamp
  return (
    <div className="flex flex-col justify-center max-h-screen" id="bookmark">
      {bookmarks?.map((bookmark: Bookmark, i) => (
        <div>
          <ContextMenu key={bookmark.id}>
            <ContextMenuTrigger>
              <div
                className="flex mt-2 flex-row w-full justify-between p-2 rounded-md cursor-pointer focus:outline-none"
                onClick={() => {
                  dispatch({ type: "select", payload: i });
                  openLink(bookmark.data);
                }}
                style={{
                  cursor: "pointer",
                  background:
                    i === state.selectedIndex ? " rgb(243 244 246)" : "white",
                }}
                role="button"
                aria-pressed={i === state.selectedIndex}
                tabIndex={0}
                id={`bookmark-${i}`}
                data-url={bookmark.data}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch({ type: "select", payload: i });
                    openLink(bookmark.data);
                  }
                }}
                onMouseDown={(e) => {
                  if (e.button === 2) {
                    dispatch({ type: "select", payload: i });
                  }
                }}
                onMouseEnter={() => {
                  dispatch({ type: "select", payload: i });
                }}
              >
                <div className="flex items-center">
                  <Image
                    src={
                      "https://www.google.com/s2/favicons?sz=64&domain_url=" +
                      fetchDomain(bookmark.data)
                    }
                    alt="logo"
                    width={20}
                    height={20}
                    className="h-5 w-5 mr-2"
                  />
                  <h2
                    className="text-md max-w-40 text-ellipsis overflow-hidden whitespace-nowrap"
                    title={bookmark.name}
                  >
                    {bookmark.name}
                  </h2>
                  <p className="text-sm text-gray-400 ml-2 max-w-96 text-ellipsis overflow-hidden whitespace-nowrap">
                    {bookmark.data}
                  </p>
                </div>
                <p className="text-sm text-gray-400 ">
                  {formateDate(bookmark.created_at)}
                </p>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-44">
              <ContextMenuItem>
                <Edit size="14" className="mr-2" /> Edit
                <ContextMenuShortcut>⌘E</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuItem
                className="cursor-pointer"
                onClick={() => copyLink(bookmark.data)}
              >
                <Copy size="14" className="mr-2" /> Copy Link
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => deleteBookmark(bookmark.id)}
                className="cursor-pointer"
              >
                <Trash size="14" className="mr-2" /> Delete
                <ContextMenuShortcut>⌘D</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      ))}
    </div>
  );
}
