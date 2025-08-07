import {Navigate, Outlet} from "react-router-dom";
import { useAppSelector } from "./hooks";


const PrivateRoute = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.authUser);

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
