import { Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import type {JSX} from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
