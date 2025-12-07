import SignIn from "../templates/SignIn.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import type {LoginData} from "../utils/quiz-types.ts";
 import {login} from "../firebase/firebaseAuthService.ts";
import {useState} from "react";
//import {login} from "../configurations/authApi.ts";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

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
            if (err instanceof Error) {
                if (err.message.includes("429")) {
                    setError("Слишком много попыток входа 😿 Подожди минутку и попробуй снова.");
                } else {
                    setError("Ошибка авторизации. Проверь логин или пароль.");
                }
                console.error("Login error: ", err.message);
                setError("Ошибка авторизации. Проверь логин или пароль.");
            } else {
                console.error("Неизвестная ошибка при входе:", err);
                setError("Что-то пошло не так...");
            }
        }
    }

    return (
        <div className={'login'}>
            <SignIn submitFn={loginWithFirebase} loginError={error}/>
        </div>
    );
};

export default Login;