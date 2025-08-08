import {Navigate, Outlet} from "react-router-dom";
import { useAppSelector } from "./hooks";


const PrivateRoute = () => {
    const {authUser, isLoading} = useAppSelector((state) => state.auth);
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }
    return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
