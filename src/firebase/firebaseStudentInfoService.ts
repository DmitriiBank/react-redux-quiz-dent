import {collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "../configurations/firebase-config";
import {Observable} from "rxjs";
import type {User} from "../utils/User";

// Функция для админа - загружает всех пользователей
export const getAllStudentInfo = (): Observable<User[]> => {
    return new Observable<User[]>((subscriber) => {
        console.log("Начинаем загрузку всех студентов");

        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (snap) => {
                console.log("Получили снапшот, количество документов:", snap.docs.length);
                const users = snap.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        uid: doc.id,
                        displayName: data.displayName || "",
                        email: data.email || "",
                        testList: data.testList || []
                    } as User;
                });
                console.log("Обработанные пользователи:", users.length);
                subscriber.next(users);
            },
            (error) => {
                console.error("Ошибка в getAllStudentInfo:", error);
                subscriber.error(error);
            }
        );
        return () => {
            console.log("Отписываемся от getAllStudentInfo");
            unsubscribe();
        };
    });
};

// Функция для обычного пользователя - загружает только свои данные
export const getCurrentUserInfo = (uid: string): Observable<User[]> => {
    return new Observable<User[]>((subscriber) => {
        if (!uid) {
            console.log("UID не предоставлен");
            subscriber.next([]);
            return () => {};
        }

        console.log("Начинаем загрузку данных пользователя:", uid);

        const unsubscribe = onSnapshot(
            doc(db, "users", uid),
            (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Документ пользователя найден");
                    const data = docSnap.data();
                    const user: User = {
                        uid: docSnap.id,
                        displayName: data.displayName || "",
                        email: data.email || "",
                        testList: data.testList || []
                    };
                    subscriber.next([user]); // Возвращаем массив с одним пользователем для совместимости
                } else {
                    console.log("Документ пользователя не найден");
                    subscriber.next([]);
                }
            },
            (error) => {
                console.error("Ошибка в getCurrentUserInfo:", error);
                subscriber.error(error);
            }
        );
        return () => {
            console.log("Отписываемся от getCurrentUserInfo");
            unsubscribe();
        };
    });
};