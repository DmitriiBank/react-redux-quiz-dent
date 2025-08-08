
import {useNavigate} from "react-router-dom";
import {Paths, type SignupData} from "../utils/quiz-types.ts";
import {registerWithEmailAndPassword} from "../firebase/firebaseAuthService.ts";
import SignUp from "../templates/SignUp.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice.ts";
import {useState} from "react";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const handleRegister = async (data: SignupData) => {
        try {
            setError('');
            const result = await registerWithEmailAndPassword(data);

            // Диспатчим данные пользователя в Redux
            dispatch(loginAction({
                email: result.email,
                displayName: result.displayName
            }));

            navigate(Paths.HOME);
        }catch (error) {
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