import ProfileDropdown from "./ProfileDropdown";
import Burger from "../sidebar/Burger";
import ThemeSwitch from "./ThemeSwitch";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import { PortalNavigationText } from "./PortalNavigationText";

export default function Navbar() {
  const { loading, authenticated } = useAuthStore();

  if (loading) return;
  return (
    <div
      className={`flex z-10 items-center ltr:pr-6 rtl:pl-4 py-1 border-b border-primary/5 bg-[rgba(0,0,0,0)] backdrop-blur-[20px] sticky justify-end top-0 gap-x-1`}
    >
      {authenticated && (
        <>
          <Burger />
          <PortalNavigationText />
          <ProfileDropdown />
        </>
      )}
      <ThemeSwitch />
    </div>
  );
}
