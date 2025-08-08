import Logout from "../../servicePages/Logout.tsx";
import {LangSwitcher} from "../langSwitcher/LangSwitcher.tsx";
import Box from "@mui/material/Box";
import {Avatar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../redux/hooks.ts";

export const Navbar = () => {
    const {authUser, displayName} = useAppSelector(state => state.auth);
    console.log(authUser, displayName)

    return (
        <div className={"navbar"}>
            <LangSwitcher />
            {authUser && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        ml: "auto",
                        mr: "15px"
                    }}
                >
                    <Avatar sx={{m: "5px"}}>{(displayName || authUser)?.[0]?.toUpperCase()}</Avatar>
                    <Typography
                        variant="subtitle1"
                        sx={{color: "black", mr: 3}}
                    >
                        {displayName || authUser}
                    </Typography>
                    <Logout />
                </Box>
            )}

        </div>
    );
};

