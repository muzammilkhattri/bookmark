import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formateDate = (timestamp: EpochTimeStamp) => {
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
export const fetchDomain = (url: string) => {
  const domain = url.replace("https://", "").replace("http://", "");
  return domain.split("/")[0];
};
export const openLink = (link: string) => {
  window.open(link, "_blank");
};

export const fetchTitle = async (link: string) => {
  try {
    const response = await axios.post("/api/fetch-title", {
      url: link,
    });
    return response.data.title;
  } catch (error) {
    console.error("Error fetching title:", error);
  }
};
