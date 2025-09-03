import Logout from "../../servicePages/Logout.tsx";
import Box from "@mui/material/Box";
import {
    Avatar,
    Drawer,
    IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../redux/hooks.ts";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import {MenuIcon} from "lucide-react";
import {useState} from "react";
import {Navbar} from "./Navbar.tsx";

export const Header = () => {
    const {email, displayName} = useAppSelector(state => state.auth);
    console.log(email, displayName)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className={"header"}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                   <div className={'burger'}>
                       <IconButton
                           aria-label="open navigation"
                           onClick={() => setOpen(true)}
                           edge="start"
                           size="large"
                       >
                           <MenuIcon />
                       </IconButton>
                   </div>


                <Typography
                    variant="h5"
                    sx={{fontWeight: 700}}
                >
                    Quiz Dent
                </Typography>
            </Box>
            {email ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: "15px",
                            mr: "15px"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mr: 3,
                                ml: 3
                            }}
                        >
                            <Avatar sx={{m: "3px"}}>{(displayName || email)?.[0]?.toUpperCase()}</Avatar>
                            <Typography
                                sx={{color: "#E5E7EB", fontSize: 20, cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },}}
                                onClick={() => navigate("/userscores")}
                            >
                                {displayName || email}
                            </Typography>
                        </Box>

                        <Logout />
                    </Box>
                )
                : (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            ml: "15px",
                            mr: "15px"
                        }}
                    >
                        <Button
                            variant={'contained'}
                            style={{
                                backgroundColor: 'green',
                                fontWeight: 'bold'
                            }}
                            onClick={async () => {
                                navigate('/login')
                            }}
                        >Login</Button>
                    </Box>

                )
            }

                <Drawer
                    anchor="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.5)" } }} // полупрозрачный фон за меню
                    PaperProps={{
                        sx: {
                            backgroundColor: "rgba(21,26,33,0.0)",
                            backdropFilter: "blur(6px)",
                            boxShadow: 6,
                            borderRadius: "0 0 16px 16px",
                            px: 2,
                            py: 2,
                            // для top-Drawer управляем высотой:
                            height: "auto",
                            maxHeight: "80vh",
                        },
                    }}
                >
                    <Box sx={{ p: 2, display: "block" }} className="navbar--drawer">
                        <Navbar />
                    </Box>
                </Drawer>

        </div>
    );
};

