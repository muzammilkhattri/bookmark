"use client";
import Link from "next/link";
import React from "react";
import { LibrarySquare } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      <h2>
        <Link href="/" className="font-medium text-md">
          <LibrarySquare className="inline-block w-7 h-7" />{" "}
        </Link>
      </h2>
    </div>
  );
}
