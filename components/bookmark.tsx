"use client";

export default function Bookmark({ bookmark }) {
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

  const formatedDate = new Date(Number(bookmark.created_at));
  // show the month and date only form timestamp
  return (
    <div className="flex mt-2 flex-row w-full justify-between">
      <div>
        <h2 className="text-md">{bookmark.name}</h2>
        <p className="text-sm text-gray-400 text-ellipsis">{bookmark.data}</p>
      </div>
      <p className="text-sm text-gray-400 text-ellipsis">
        {formateDate(bookmark.created_at)}
      </p>
    </div>
  );
}
