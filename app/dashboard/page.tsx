import BookmarkInput from "@/components/bookmark-input";
import BookmarkList from "@/components/bookmark-list";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const supbase = createServerComponentClient({ cookies });
  const { data: session } = await supbase.auth.getSession();
  if (!session.session) {
    redirect("/login");
  }
  const user = await supbase.auth.getUser();
  const userId = user?.data?.user?.id!;
  return (
    <div className="flex flex-col items-center">
      <BookmarkInput id_user={userId} />
      <BookmarkList query={query} id_user={userId} />
    </div>
  );
}
