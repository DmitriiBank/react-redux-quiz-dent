import { useDispatch, useSelector } from "react-redux";
import type {RootState} from "../../redux/store.ts";
import {setLanguage} from "../../redux/slices/langSlice.ts";


export const LangSwitcher = () => {
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.lang.language);

    return (
        <div className="lang-switch">
            <button style={{width: 100, margin: 4}} onClick={() => dispatch(setLanguage('ru'))} disabled={lang === 'ru'}>
                Русский
            </button>
            <button style={{width: 100}} onClick={() => dispatch(setLanguage('he'))} disabled={lang === 'he'}>
                עברית
            </button>
        </div>
    );
};
