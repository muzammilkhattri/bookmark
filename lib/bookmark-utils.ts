export const formateDate = (timestamp) => {
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
