import {useNavigate} from "react-router-dom";
import {Paths} from "../utils/quiz-types.ts";
import {registerWithEmailAndPassword} from "../firebase/firebaseAuthService.ts";
import SignUp from "../templates/SignUp.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice.ts";
import {useState} from "react";
import type {UserDto} from "../utils/User.ts";
import {FirebaseError} from 'firebase/app';
// import {register} from "../configurations/authApi.ts";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorCode, setErrorCode] = useState<string | null>(null);


    const handleRegister = async (data: UserDto) => {
        try {
            setErrorCode(null);
            const result = await registerWithEmailAndPassword(data);
            // const result = await register(data);

            console.log('Результат регистрации:', result);

            if (result) {
                // Диспатчим данные пользователя в Redux с uid
                dispatch(loginAction({
                    uid: result.uid,
                    email: result.email,
                    displayName: result.displayName,
                    testList: result.tests || [],
                    isAuth: true,
                    isLoading: false
                }));

                console.log('Redux action dispatched with uid:', result.uid);
                navigate(Paths.HOME);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err instanceof FirebaseError) {
                setErrorCode(err.code);
            }  else {
                setErrorCode('default');
            }
            throw err;
        }
    }
    return (
        <div>
            <SignUp submitFunc={handleRegister} serverErrorKey={errorCode} />
        </div>
    );
};

export default Registration;