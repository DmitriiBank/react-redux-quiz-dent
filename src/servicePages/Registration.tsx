import {useNavigate} from "react-router-dom";
import {Paths} from "../utils/quiz-types.ts";
import {registerWithEmailAndPassword} from "../firebase/firebaseAuthService.ts";
import SignUp from "../templates/SignUp.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice.ts";
import {useState} from "react";
import type {UserDto} from "../utils/User.ts";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const handleRegister = async (data: UserDto) => {
        try {
            setError('');
            const result = await registerWithEmailAndPassword(data);
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
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Registration failed');
            }
        }
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <SignUp submitFunc={handleRegister}/>
        </div>
    );
};

export default Registration;