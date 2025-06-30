import './App.css';
import { Navigate, Route, Routes } from "react-router-dom";
import QuizSelectionPage from "./components/QuizSelectionPage.tsx";
import QuizPage from "./components/QuizPage.tsx";
// import Login from "./servicePages/Login.tsx";
import ErrorPage from "./servicePages/ErrorPage.tsx";
import { Paths } from "./utils/quiz-types.ts";
// import PrivateRoute from "./redux/PrivateRoute.tsx";
import Logout from "./servicePages/Logout.tsx";

function App() {
    return (
        <Routes>
            {/*<Route path={Paths.LOGIN} element={<Login />} />*/}

            <Route
                path={Paths.HOME}
                element={
                    // <PrivateRoute>
                        <QuizSelectionPage />
                    // </PrivateRoute>
                }
            />

            <Route
                path={`${Paths.QUIZ}/:quizId`}
                element={
                    // <PrivateRoute>
                        <QuizPage />
                    // </PrivateRoute>
                }
            />
            <Route path={Paths.LOGOUT} element={<Logout />} />
            <Route path={Paths.ERROR} element={<ErrorPage />} />
            <Route path="*" element={<Navigate to={Paths.ERROR} replace />} />
        </Routes>
    );
}

export default App;
