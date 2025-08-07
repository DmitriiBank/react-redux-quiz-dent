
import SignIn from "../templates/SignIn.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import type {LoginData} from "../utils/quiz-types.ts";
import {login} from "../firebase/firebaseAuthService.ts";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginWithFirebase = async (loginData: LoginData) => {
        try{
            const userData = await login(loginData);
            dispatch(loginAction(userData));
            navigate("/");
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div>
            <SignIn  submitFn={loginWithFirebase} />
           </div>
    );
};

export default Login;