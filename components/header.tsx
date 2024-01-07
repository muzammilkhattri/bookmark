import UserButton from "./user-button";
import Link from "next/link";
import { LibrarySquare } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky flex items-center justify-between w-full h-12 max-w-2xl mx-auto">
      <Link href="/" className="font-medium text-md">
        <LibrarySquare className="inline-block w-7 h-7" />{" "}
      </Link>
      <UserButton />
    </header>
  );
}
