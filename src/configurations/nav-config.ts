import {Paths, Roles, type RouteType} from "../utils/quiz-types.ts";


export const navItems: RouteType[] = [
    {path: Paths.HOME, title: 'Home', role: Roles.ALL},
    {path: Paths.QUIZ, title: 'Orders', role: Roles.AUTH},
    {path: Paths.USERSCORES, title: 'Customers', role: Roles.ADMIN},
    {path: Paths.LOGIN, title: 'Login', role: Roles.NO_AUTH},
    {path: Paths.LOGOUT, title: 'Logout', role: Roles.AUTH},
]

export const errorItem: RouteType[] = [
    {path: Paths.ERROR, title: 'Error'},
]

