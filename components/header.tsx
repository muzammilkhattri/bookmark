import { MainNav } from "./main-nav";
import UserButton from "./user-button";

export default function Header() {
  return (
    <header className="sticky flex justify-center">
      <div className="flex items-center justify-between w-full h-12 max-w-2xl mx-auto">
        <MainNav />
        <UserButton />
      </div>
    </header>
  );
}
