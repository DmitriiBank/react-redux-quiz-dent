import Logout from "../../servicePages/Logout.tsx";
import {LangSwitcher} from "../langSwitcher/LangSwitcher.tsx";
import Box from "@mui/material/Box";
import {Avatar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../redux/hooks.ts";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export const Navbar = () => {
    const {email, displayName} = useAppSelector(state => state.auth);
    console.log(email, displayName)
    const navigate = useNavigate()
    return (
        <div className={"navbar"}>
            <Button
                sx={{mr: "auto"}}
                onClick={() => navigate('/')}
            >
                На главную
            </Button>
            <LangSwitcher />
            {email && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: "auto",
                        mr: "15px"
                    }}
                >
                    <Avatar sx={{m: "5px"}}>{(displayName || email)?.[0]?.toUpperCase()}</Avatar>
                    <Typography
                        variant="subtitle1"
                        sx={{color: "black", mr: 3}}
                    >
                        {displayName || email}
                    </Typography>
                    <Logout />
                </Box>
            )}

        </div>
    );
};

