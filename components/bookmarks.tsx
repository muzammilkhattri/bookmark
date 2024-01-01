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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
type params = {
  bookmarks: Bookmark;
};
import { useEffect, useState, useReducer } from "react";
const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};
const initialState = { selectedIndex: 0 };

export default function Bookmarks({ bookmarks }: params) {
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
        return { selectedIndex: action.payload };
      default:
        throw new Error();
    }
  };
  const formateDate = (timestamp) => {
    const date = new Date(timestamp);

    // Array of month names
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the month and day from the Date object
    const month = months[date.getMonth()];
    const day = date.getDate();

    // Format the result as "Month Day"
    const formattedDate = `${month} ${day}`;

    return formattedDate;
  };
  const fetchDomain = (url: string) => {
    const domain = url.replace("https://", "").replace("http://", "");
    return domain.split("/")[0];
  };
  const openLink = (link: string) => {
    window.open(link, "_blank");
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
    <div className="flex flex-col justify-center" id="bookmark">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch({ type: "select", payload: i });
                    openLink(bookmark.data);
                  }
                }}
              >
                <div className="flex items-center">
                  <Image
                    src={`https://${fetchDomain(bookmark.data)}/favicon.ico`}
                    alt="logo"
                    width={20}
                    height={20}
                    className="h-5 w-5 mr-2"
                  />
                  <h2 className="text-md max-w-40 text-ellipsis overflow-hidden whitespace-nowrap">
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
            <ContextMenuContent className="w-64">
              <ContextMenuItem inset>
                Edit
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuItem inset>
                Open
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem inset>
                Delete
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      ))}
    </div>
  );
}
