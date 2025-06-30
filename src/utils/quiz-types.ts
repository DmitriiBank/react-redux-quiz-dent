export enum Paths {
    LOGIN = "/login",
    HOME = "/",
    QUIZ = "/quiz",
    ERROR = "/error",
    LOGOUT = "/logout",
}

export type RouteType = {
    path: Paths,
    title: string,
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: number;
    image?: string;
    iframe?: string;
}

export interface QuizData {
    id: string;
    title: string;
    description: string;
    icon?: string;
    questions?: QuizQuestion[];
}

export const quizzes = [
    {
        id: "lesson1",
        title: "Лекция 1",
        description: "Введение в стоматологию",
        icon: "/image/icon_1.png",
    },
    {
        id: "lesson2",
        title: "Лекция 2",
        description: "Ортопедическая стоматология",
        icon: "/image/icon_2.png",
    },
    {
        id: "lesson3",
        title: "Лекция 3",
        description: "Несъемное протезирование",
        icon: "/image/icon_3.png",
    },
    {
        id: "lesson4",
        title: "Лекция 4",
        description: "Окклюзия, прикус, артикуляция",
        icon: "/image/icon_4.png",
    },
    {
        id: "lesson5",
        title: "Лекция 5",
        description: "Анатомия коронок зубов верхней челюсти",
        icon: "/image/icon_5.png",
    },
    {
        id: "lesson6",
        title: "Лекция 6",
        description: "Анатомия коронок зубов нижней челюсти. Виды прикусов",
        icon: "/image/icon_6.png",
    },
    {
        id: "lesson7",
        title: "Лекция 7",
        description: "Съёмное протезирование",
        icon: "/image/icon_7.png",
    },
    {
        id: 'lesson8',
        title: 'Лекция 8',
        description: 'Имплантация и хирургические шаблоны',
        icon: "/image/icon_8.png"
    }
];
