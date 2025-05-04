import { useEffect } from "react";
import { useAuthStore } from "./stores/permission/auth-permssion-store";

export default function AppLoader() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return null; // or a loader/spinner component
}
