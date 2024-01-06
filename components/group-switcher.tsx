"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";
import { load } from "cheerio";
import SpinnerAnimation from "./Spinner";

const groups = [
  {
    label: "Groups",
    teams: [],
  },
];

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function GroupSwitcher({ className }: TeamSwitcherProps) {
  const supabase = createClientComponentClient();
  const [groupsState, setGroupsState] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState();
  React.useEffect(() => {
    const fetchGroups = async () => {
      const user = await supabase.auth.getUser();
      const { data: groupsData, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id_user", user.data?.user?.id);
      setGroupsState(groupsData);
      setSelectedTeam(groupsData[0].name);
    };
    fetchGroups();
  }, [loading]);

  const [open, setOpen] = React.useState(false);
  const [showNewGroupDialog, setShowGroupTeamDialog] = React.useState(false);
  const createGroup = async () => {
    setLoading(true);
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase.from("groups").insert([
      {
        id_user: user.data?.user?.id,
        name: groupName,
      },
    ]);
    setShowGroupTeamDialog(false);
    toast.success("Group created successfully");
    setGroupsState([...groupsState, { name: groupName }]);
    setLoading(false);
  };
  return (
    <Dialog open={showNewGroupDialog} onOpenChange={setShowGroupTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${encodeURI(
                  selectedTeam?.replace(/[^a-zA-Z ]/g, "")
                )}.png`}
                alt={selectedTeam}
              />
            </Avatar>
            {selectedTeam}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search group..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Groups">
                {groupsState.map((group) => (
                  <CommandItem
                    key={group.name}
                    onSelect={() => {
                      setSelectedTeam(group.name);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${encodeURI(
                          group.name.replace(/[^a-zA-Z ]/g, "")
                        )}.png`}
                        alt={group.name}
                      />
                    </Avatar>
                    {group.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTeam === group.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowGroupTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Group
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Add a new group to manage your bookmarks easily.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="UI / UX."
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowGroupTeamDialog(false)}
          >
            Cancel
          </Button>
          {loading ? (
            <Button disabled>
              <SpinnerAnimation /> Creating
            </Button>
          ) : (
            <Button onClick={createGroup}>Create</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
