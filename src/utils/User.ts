
export type UserDto = {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
}
export type User = {
    uid: string,
    displayName: string,
    email: string,
    // password: string,
    testList: TestRecord[]
}
export type TestRecord = {
    idTest: string;
    title: string;
    score: string | null;
    completed: boolean;
}

export const initialTests: TestRecord[] = [
    {idTest: "lesson1", title: "Лекция 1", score: null, completed: false},
    {idTest: "lesson2", title: "Лекция 2", score: null, completed: false},
    {idTest: "lesson3", title: "Лекция 3", score: null, completed: false},
    {idTest: "lesson4", title: "Лекция 4", score: null, completed: false},
    {idTest: "lesson5", title: "Лекция 5", score: null, completed: false},
    {idTest: "lesson6", title: "Лекция 6", score: null, completed: false},
    {idTest: "lesson7", title: "Лекция 7", score: null, completed: false},
    {idTest: "lesson8", title: "Лекция 8", score: null, completed: false},
];

export const ADMIN_EMAILS = new Set([
    "dm.skakov@gmail.com",
]);
