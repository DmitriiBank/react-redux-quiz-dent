import './App.css';
import './index.css';
import { Route, Routes} from "react-router-dom";
import ErrorPage from "./servicePages/ErrorPage.tsx";
import {Paths} from "./utils/quiz-types.ts";
import Logout from "./servicePages/Logout.tsx";
import QuizSelectionPage_lang from "./components/QuizSelectionPage_lang.tsx";
import QuizPage_lang from "./components/QuizPage_lang.tsx";
import {useAppDispatch} from "./redux/hooks.ts";
import Login from "./servicePages/Login.tsx";
import PrivateRoute from "./redux/PrivateRoute.tsx";
import Registration from "./servicePages/Registration.tsx";
import {useEffect} from "react";
import {loginAction, logout} from "./redux/slices/authSlice.ts";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './configurations/firebase-config.ts';


function App() {
    //const {authUser} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(loginAction({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    testList: [],
                    isLoading: false,
                    isAuth: true
                }));
            } else {
                dispatch(logout());
            }
        });

        // Отписаться при размонтировании компонента
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <div className={'app'}>
            <Routes>
                <Route
                    path={Paths.HOME}
                    element={<QuizSelectionPage_lang />}
                />
                <Route element={<PrivateRoute />}>
                    <Route
                        path={`${Paths.QUIZ}/:quizId`}
                        element={<QuizPage_lang />}
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
