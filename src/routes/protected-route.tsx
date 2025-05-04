import { UserPermission } from "@/database/tables";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  element: React.ReactNode;
  routeName: string;
  permissions: Map<string, UserPermission>;
  authenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  routeName,
  permissions,
  authenticated,
}) => {
  const isAllowed = permissions.get(routeName);
  return isAllowed && authenticated ? (
    element
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
export default ProtectedRoute;
