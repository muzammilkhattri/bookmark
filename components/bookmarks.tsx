"use client";
import { Tables } from "@/types/supabase";
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
import { Copy, Edit, Scroll, Trash } from "lucide-react";
import { useKeyPress } from "@/lib/hooks/useKeyPress";
import { formateDate, fetchDomain, openLink } from "@/lib/utils";
import { useHotkeys } from "@mantine/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialState = { selectedIndex: 0 };
interface SelectedIndexState {
  selectedIndex: number;
}
type Bookmark = Tables<"bookmarks">;
type Action = {
  type: string;
  payload?: number;
};
export default function Bookmarks({
  serverBookmarks,
}: {
  serverBookmarks: Bookmark[];
}) {
  const [bookmarks, setBookmarks] = useState(serverBookmarks);
  const supabase = createClientComponentClient();

  useHotkeys([
    [
      "ctrl+c",
      () => {
        const urlToCopy = document.getElementById(
          `bookmark-${state.selectedIndex}`
        )?.dataset.url;
        copyLink(urlToCopy as string);
      },
    ],
    [
      "ctrl+d",
      () => {
        const idToDelete: any = document.getElementById(
          `bookmark-${state.selectedIndex}`
        )?.dataset.id;
        deleteBookmark(idToDelete);
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
  const reducer = (
    state: SelectedIndexState,
    action: Action
  ): SelectedIndexState => {
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
        return { selectedIndex: action.payload as number };
      default:
        throw new Error();
    }
  };
  const deleteBookmark = async (id: number) => {
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

  // update the selected index when arrow up or down is pressed
  useEffect(() => {
    if (arrowDownPressed) {
      dispatch({ type: "arrowDown" });
    }
    if (arrowUpPressed) {
      dispatch({ type: "arrowUp" });
    }
  }, [arrowDownPressed, arrowUpPressed]);

  return (
    <ScrollArea className="max-h-screen px-2">
      <div className="flex flex-col justify-center " id="bookmark">
        {bookmarks?.map((bookmark: Bookmark, i) => (
          <div>
            <ContextMenu key={bookmark.id}>
              <ContextMenuTrigger>
                <div
                  className="flex mt-2 flex-row w-full justify-between p-2 rounded-md cursor-pointer focus:outline-none"
                  onClick={() => {
                    openLink(bookmark.data);
                  }}
                  style={{
                    cursor: "pointer",
                    background:
                      i === state.selectedIndex
                        ? " rgb(243 244 246)"
                        : "hsl(300 50% 99%)",
                  }}
                  role="button"
                  aria-pressed={i === state.selectedIndex}
                  tabIndex={0}
                  id={`bookmark-${i}`}
                  data-url={bookmark.data}
                  data-id={bookmark.id}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      openLink(bookmark.data);
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
    </ScrollArea>
  );
}
