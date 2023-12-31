import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between px-10 items-center w-full h-20 border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="font-bold text-2xl">Bookmark</h1>
      </div>
      <div className="gap-2 flex items-center font-medium text-md">
        <Link
          href="/login"
          className={`${buttonVariants({
            variant: "default",
            size: "lg",
          })} mr-2 text-lg w-18`}
        >
          Login <ArrowRight size="16" className="ml-2" />
        </Link>
      </div>
    </nav>
  );
}
