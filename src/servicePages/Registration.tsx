
import {useNavigate} from "react-router-dom";
import {type SignupData} from "../utils/quiz-types.ts";
import {registerWithEmailAndPassword} from "../firebase/firebaseAuthService.ts";
import SignUp from "../templates/SignUp.tsx";
import {useDispatch} from "react-redux";
import {loginAction} from "../redux/slices/authSlice.ts";

const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const signUpWithEmail = async (signupData: SignupData) => {
        try {
            const userData = await registerWithEmailAndPassword(signupData);
            dispatch(loginAction(userData));
            navigate("/");
        } catch(err) {
            console.log(err); // Todo: handle error properly
        }
    }
        return (
            <div>
                <SignUp submitFunc={signUpWithEmail}/>
            </div>
        );
    };

    export default Registration;