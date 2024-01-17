import Link from "next/link";

import PortalButton from "./_navbar-comps/portal-button";
import NavMenu from "./_navbar-comps/nav-menu";
import ProfileButton from "./_navbar-comps/profile-button";
import { ModeToggle } from "../mode-toggle";
import AdminNav from "./_navbar-comps/admin-nav";
import { Input } from "../ui/input";

export default function Navbar() {
  return (
    <div className="border-b">
      <header>
        <div className="container  flex  justify-between py-4">
          <div className="flex items-center ">
            <Link href="/" className="mr-10 text-xl font-semibold">
              HeartSpring
            </Link>
            <NavMenu />
          </div>
          <div className="flex gap-4">
            {/* <PortalButton /> */}
            <Input
              type="text"
              placeholder="Search..."
              className="w-[25\0px] rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <ModeToggle />
            <ProfileButton />
          </div>
        </div>
        <AdminNav />
      </header>
    </div>
  );
}
