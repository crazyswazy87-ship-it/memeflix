import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "@/constants/context/AuthContext";
import Loader from "@/components/shared/Loader";

const AdminRoute = () => {
  const { user, isLoading } = useUserContext();

  if (isLoading) return <Loader />;

  if (!user || !user.id) return <Navigate to="/" replace />;

  const hasAccess =
  user?.isAdmin === true || user?.isMods === true;

  if (!hasAccess) return <Navigate to="/" replace />;
 
  console.log("CONTEXT USER:", user);

  return <Outlet />;
};

export default AdminRoute;