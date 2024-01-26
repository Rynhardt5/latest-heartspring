import Link from "next/link";
import Image from "next/image";

import NavMenu from "./_navbar-comps/nav-menu";
import ProfileButton from "./_navbar-comps/profile-button";
import { ModeToggle } from "../mode-toggle";
import AdminNav from "./_navbar-comps/admin-nav";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import CartButton from "./_navbar-comps/cart-button";

export default function Navbar() {
  return (
    <div className="border-b">
      <header>
        <div className="container  flex  justify-between py-4">
          <div className="flex items-center ">
            <Link href="/" className="mr-10 text-xl font-semibold">
              <Image
                src="/logo/Heart-Spring_logo_header.png"
                width={200}
                height={45}
                alt="Heart Spring logo"
              />
            </Link>
            <NavMenu />
          </div>
          <div className="flex gap-3">
            {/* <PortalButton /> */}
            <div className="relative">
              <Input
                className="w-[300px] pl-10"
                placeholder="Search..."
                // onChange={(e) => setSearch(e.target.value)}
              />
              <SearchIcon className="absolute left-2 top-2 h-6 w-6 text-foreground/60" />
            </div>
            <div className="flex gap-3">
              <ModeToggle />
              <CartButton />
              <ProfileButton />
            </div>
          </div>
        </div>
        <AdminNav />
      </header>
    </div>
  );
}
