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
export default function Bookmarks({ bookmarks }: params) {
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
  // show the month and date only form timestamp
  return (
    <div className="flex flex-col " id="bookmark">
      {bookmarks?.map((bookmark: Bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div
              className="flex mt-2 flex-row w-full justify-between hover:bg-gray-100 p-2 rounded-md cursor-pointer"
              onClick={() => openLink(bookmark.data)}
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
      ))}
    </div>
  );
}
