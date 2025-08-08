import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import {logout} from "../redux/slices/authSlice.ts";
import {useNavigate} from "react-router-dom";
import {exit} from "../firebase/firebaseAuthService.ts";



const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div>
            <Button variant={'contained'}
                    style={{backgroundColor: 'red', fontWeight: 'bold'}}
                    onClick={async () => {
                        alert("Are you sure?")
                        dispatch(logout());
                        await exit();
                        navigate('/')
                    }}
            >Exit</Button>
        </div>
    );
};

export default Logout;