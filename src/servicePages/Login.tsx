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
        try {
            const userData = await login(loginData);
            console.log('Данные от Firebase auth service:', userData);

            // Убеждаемся, что uid передается в Redux
            dispatch(loginAction({
                uid: userData.uid,
                email: userData.email,
                displayName: userData.displayName,
                testList: userData.tests || [], // Исправлено: userData.tests -> testList
                isAuth: true,
                isLoading: false
            }));

            console.log('Redux action dispatched with uid:', userData.uid);
            navigate("/");
        } catch(err) {
            console.error('Login error:', err);
        }
    }

    return (
        <div>
            <SignIn submitFn={loginWithFirebase} />
        </div>
    );
};

export default Login;