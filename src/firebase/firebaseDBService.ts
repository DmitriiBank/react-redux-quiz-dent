import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import {db, auth} from "../configurations/firebase-config";
import type {TestRecord} from "../utils/User.ts";
import type {SignupData} from "../utils/quiz-types.ts";

export const createUserInDb = async (userDto: SignupData) => {
    console.log('🔥 Создаем пользователя в Firestore');
    console.log('📝 Данные:', userDto);

    try {
        // Используем UID из Firebase Auth, а не генерируем новый
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Пользователь не аутентифицирован');
        }

        const displayName = `${userDto.first_name} ${userDto.last_name}`.trim();

        const newUser = {
            uid: currentUser.uid, // Используем реальный UID
            displayName,
            email: userDto.email,
            testList: [] // Исправлено: было tests, должно быть testList
        };

        console.log('📤 Сохраняем данные:', newUser);
        console.log('📍 В документ с ID:', newUser.uid);

        await setDoc(doc(db, "users", newUser.uid), newUser);
        console.log('✅ Пользователь успешно создан в Firestore!');

        // Проверяем сохранение
        const savedDoc = await getDoc(doc(db, "users", newUser.uid));
        if (savedDoc.exists()) {
            console.log('✅ Подтверждение: данные сохранены');
            console.log('📄 Сохраненные данные:', savedDoc.data());
        } else {
            console.error('❌ Данные не найдены после сохранения');
        }

        return newUser;

    } catch (error) {
        console.error('❌ Ошибка при создании пользователя:', error);
        throw error;
    }
};

export const saveTestResult = async (
    uid: string,
    idTest: string,
    score: number,
    totalQuestions: number
) => {
    console.log('💾 Сохраняем результат теста:', {
        uid,
        idTest,
        score,
        totalQuestions
    });

    try {
        const scoreString = `${score}/${totalQuestions}`;
        const userRef = doc(db, "users", uid);

        // Создаем новый тест-рекорд
        const newTestRecord: TestRecord = {
            idTest,
            title: getTestTitle(idTest), // Функция для получения названия
            score: scoreString,
            completed: true
        };

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const updatedTests = userData.testList || [];

            // Проверяем, есть ли уже такой тест
            const existingTestIndex = updatedTests.findIndex((test: TestRecord) => test.idTest === idTest);

            if (existingTestIndex >= 0) {
                // Обновляем существующий тест
                updatedTests[existingTestIndex] = newTestRecord;
            } else {
                // Добавляем новый тест
                updatedTests.push(newTestRecord);
            }

            await updateDoc(userRef, { testList: updatedTests });
            console.log('✅ Результат теста сохранен');
            return true;
        } else {
            console.error('❌ Пользователь не найден:', uid);
            throw new Error("Пользователь не найден");
        }
    } catch (error) {
        console.error('❌ Ошибка при сохранении результата:', error);
        throw error;
    }
};

// Вспомогательная функция для получения названия теста
const getTestTitle = (testId: string): string => {
    const testTitles: { [key: string]: string } = {
        "lesson1": "Лекция 1",
        "lesson2": "Лекция 2",
        "lesson3": "Лекция 3",
        "lesson4": "Лекция 4",
        "lesson5": "Лекция 5",
        "lesson6": "Лекция 6",
        "lesson7": "Лекция 7",
        "lesson8": "Лекция 8"
    };
    return testTitles[testId] || `Тест ${testId}`;
};

export const canTakeTest = async (uid: string, testId: string): Promise<boolean> => {
    try {
        // Проверяем, что uid не пустой
        if (!uid || !testId) {
            console.warn('canTakeTest: отсутствует uid или testId');
            return true; // Разрешаем прохождение если нет данных
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const test = userData.testList?.find((t: TestRecord) => t.idTest === testId);
            return test ? !test.completed : true; // Если тест найден, проверяем completed, иначе разрешаем
        }

        return true; // Если пользователь не найден, разрешаем прохождение
    } catch (error) {
        console.error('Ошибка при проверке доступности теста:', error);
        return true; // В случае ошибки разрешаем прохождение
    }
};

export const getUserData = async (uid: string | null | undefined) => {
    try {
        if (!uid) {
            console.warn('getUserData: отсутствует uid');
            return null;
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        }

        return null;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return null;
    }
};