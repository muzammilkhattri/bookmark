import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import BookmarkInput from "@/components/bookmark-input";
import BookmarkList from "@/components/bookmark-list";
export default function Page() {
  return (
    <div className="flex flex-col items-center">
      <BookmarkInput />
      <BookmarkList />
    </div>
  );
}
