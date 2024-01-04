import BookmarkInput from "@/components/bookmark-input";
import BookmarkList from "@/components/bookmark-list";
export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";

  return (
    <div className="flex flex-col items-center">
      <BookmarkInput />
      <BookmarkList query={query} />
    </div>
  );
}
