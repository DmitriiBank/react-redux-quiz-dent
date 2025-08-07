import './App.css';
import './index.css';
import { Route, Routes} from "react-router-dom";
//import QuizSelectionPage from "./components/QuizSelectionPage.tsx";
// import Login from "./servicePages/Login.tsx";
import ErrorPage from "./servicePages/ErrorPage.tsx";
import {Paths} from "./utils/quiz-types.ts";
// import PrivateRoute from "./redux/PrivateRoute.tsx";
import Logout from "./servicePages/Logout.tsx";
import QuizSelectionPage_lang from "./components/QuizSelectionPage_lang.tsx";
// import {useSelector} from "react-redux";
// import type {RootState} from "./redux/store.ts";
import QuizPage_lang from "./components/QuizPage_lang.tsx";
import {useAppSelector} from "./redux/hooks.ts";
import Login from "./servicePages/Login.tsx";
import PrivateRoute from "./redux/PrivateRoute.tsx";
import Registration from "./servicePages/Registration.tsx";

function App() {
    const lang = useAppSelector(state => state.lang.language);
    // const {authUser} = useAppSelector(state => state.auth);
    // const dispatch = useAppDispatch()

    return (
        <div className={'app'}>
            <Routes>
                <Route
                    path={Paths.HOME}
                    element={<QuizSelectionPage_lang lang={lang} />}
                />
                <Route element={<PrivateRoute />}>
                    <Route
                        path={`${Paths.QUIZ}/:quizId`}
                        element={<QuizPage_lang lang={lang} />}
                    />
                </Route>

                <Route
                    path={Paths.LOGIN}
                    element={<Login />}
                />
                <Route
                    path={Paths.LOGOUT}
                    element={<Logout />}
                />
                <Route
                    path={Paths.REGISTER}
                    element={<Registration />}
                />
                <Route
                    path={Paths.ERROR}
                    element={<ErrorPage />}
                />
                {/*<Route*/}
                {/*    path="*"*/}
                {/*    element={<Navigate*/}
                {/*        to={Paths.HOME}*/}
                {/*        replace*/}
                {/*    />}*/}
                {/*/>*/}
            </Routes>
        </div>
    );
}

export default App;
