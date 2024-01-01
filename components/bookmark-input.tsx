"use client";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { Command } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHotkeys } from "@mantine/hooks";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import SpinnerAnimation from "./Spinner";
export default function BookmarkInput() {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const resetInput = () => {
    setData("");
    setName("");
    setLoading(false);
  };
  useHotkeys([
    ["ctrl+f", () => document.getElementById("input-data")?.focus()],
  ]);
  const CreateBookmark = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    const { data: create, error } = await supabase.from("bookmarks").insert([
      {
        name: name,
        data: data,
        id_user: user.data.user?.id,
      },
    ]);
    if (error) {
      console.log(error);
    } else {
      setOpen(false);
      toast.success("Bookmark Created");
      resetInput();
    }
  };
  return (
    <div className="max-w-2xl w-full flex items-center shadow-sm border-2 p-2 rounded-md ring-gray-400 border-gray focus-within:ring-2">
      <PlusIcon className="h-6 w-[5%]" />
      <Input
        placeholder="Insert a link, color, or just plain text"
        className="w-[89%] border-none shadow-none focus-visible:ring-0"
        onChange={(e) => setData(e.target.value)}
        value={data}
        id="input-data"
        onKeyDown={(e) => {
          if (e.key === "Enter") setOpen(true);
        }}
      />
      <div className="flex items-center w-[6%] bg-gray-100  p-1 rounded-md">
        <Command size="18" />
        <p>F</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
                value={name}
                onKeyDown={(e) => {
                  if (e.key === "Enter") CreateBookmark();
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Data
              </Label>
              <Input
                id="username"
                className="col-span-3"
                onChange={(e) => setData(e.target.value)}
                value={data}
                onKeyDown={(e) => {
                  if (e.key === "Enter") CreateBookmark();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="" disabled>
                Create <SpinnerAnimation />
              </Button>
            ) : (
              <Button type="button" onClick={CreateBookmark}>
                Create
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
