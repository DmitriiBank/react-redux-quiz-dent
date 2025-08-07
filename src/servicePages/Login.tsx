
import SignIn from "../templates/SignIn.tsx";
import {useDispatch} from "react-redux";
import {login} from "../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = ({ email, password }: { email: string; password: string }) => {
        if (email === "admin@admin.co.il" && password === "admin451") {
            dispatch(login());
            navigate("/");
        } else {
            setError("Incorrect login or password");
        }
    };

    return (
        <div>
            <SignIn onSubmit={handleLogin} />
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;