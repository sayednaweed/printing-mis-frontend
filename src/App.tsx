import { PortalEnum } from "./lib/constants";
import {
  getExpenseRouter,
  getGuestRouter,
  getHrRouter,
  getInventoryRouter,
} from "./routes/routes";
import { useAuthStore } from "./stores/permission/auth-permssion-store";

export default function App() {
  const { user, loading, authenticated, portal } = useAuthStore();

  if (loading) return;
  let routes = null;
  if (!authenticated) routes = getGuestRouter();
  else {
    routes =
      portal == PortalEnum.inventory
        ? getInventoryRouter(user, authenticated)
        : portal == PortalEnum.hr
        ? getHrRouter(user, authenticated)
        : portal == PortalEnum.expense
        ? getExpenseRouter(user, authenticated)
        : getGuestRouter();
  }
  return routes;
}
