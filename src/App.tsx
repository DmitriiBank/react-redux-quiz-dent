import './App.css';
import './index.css';
import {Navigate, Route, Routes} from "react-router-dom";
//import QuizSelectionPage from "./components/QuizSelectionPage.tsx";
// import Login from "./servicePages/Login.tsx";
import ErrorPage from "./servicePages/ErrorPage.tsx";
import {Paths} from "./utils/quiz-types.ts";
// import PrivateRoute from "./redux/PrivateRoute.tsx";
import Logout from "./servicePages/Logout.tsx";
import QuizSelectionPage_lang from "./components/QuizSelectionPage_lang.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "./redux/store.ts";
import QuizPage_lang from "./components/QuizPage_lang.tsx";

function App() {
    const lang = useSelector((state: RootState) => state.lang.language);

    return (
        <div className={'app'}>
            <Routes>
                {/*<Route path={Paths.LOGIN} element={<Login />} />*/}

                <Route
                    path={Paths.HOME}
                    element={
                        // <PrivateRoute>
                        //     <QuizSelectionPage />
                        <QuizSelectionPage_lang lang={lang} />
                        // </PrivateRoute>
                    }
                />

                <Route
                    path={`${Paths.QUIZ}/:quizId`}
                    element={
                        // <PrivateRoute>
                        //<QuizPage />
                        <QuizPage_lang lang={lang} />
                        // </PrivateRoute>
                    }
                />
                <Route
                    path={Paths.LOGOUT}
                    element={<Logout />}
                />
                <Route
                    path={Paths.ERROR}
                    element={<ErrorPage />}
                />
                <Route
                    path="*"
                    element={<Navigate
                        to={Paths.ERROR}
                        replace
                    />}
                />
            </Routes>
        </div>
    );
}

export default App;
