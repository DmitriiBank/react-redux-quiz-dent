import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";
import {Navbar} from "./components/Navbar/Navbar.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <HashRouter>
            <Navbar />
            <App />
        </HashRouter>
    </Provider>
)
