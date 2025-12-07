import {Route, Routes} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./redux/hooks.ts";
import PrivateRoute from "./redux/PrivateRoute.tsx";
import {useEffect} from "react";
import {loginAction, logout} from "./redux/slices/authSlice.ts";
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './configurations/firebase-config.ts';
import {routes} from './configurations/routeConfig.tsx'
import {Roles} from './utils/quiz-types';

function AppShell({children}: { children: React.ReactNode }) {
    const lang = useAppSelector(s => s.lang.language);

    useEffect(() => {
        // HTML-lang и направление письма
        document.documentElement.lang = lang === 'he' ? 'he' : 'ru';
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    }, [lang]);

    return <>{children}</>;
}

function App() {
    const {isLoading} = useAppSelector(state => state.auth);
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

        return () => unsubscribe();
    }, [dispatch]);


    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    //             .then(res => res.json())
    //             .then(user => dispatch(loginAction({ ...user, isAuth: true })))
    //             .catch(() => dispatch(logout()));
    //     }
    // }, [dispatch]);
    if (isLoading) {
        return <div className="fullscreen-loader">Загрузка...</div>;
    }
    return (
        <AppShell>
            <div className={'app'}>
                <Routes>
                    {routes.map(({path, element, role}) =>
                        role === Roles.USER || role as Roles === Roles.ADMIN ? (
                            <Route
                                key={path}
                                element={<PrivateRoute />}
                            >
                                <Route
                                    path={path}
                                    element={element}
                                />
                            </Route>
                        ) : (
                            <Route
                                key={path}
                                path={path}
                                element={element}
                            />
                        )
                    )}
                </Routes>
            </div>
        </AppShell>
    );
}

export default App;
