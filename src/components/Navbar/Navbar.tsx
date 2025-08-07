import Logout from "../../servicePages/Logout.tsx";
import {LangSwitcher} from "../langSwitcher/LangSwitcher.tsx";

export const Navbar = () => {
    return (
        <div className={"navbar"}>
            <Logout/>
           <LangSwitcher/>
        </div>
    );
};

