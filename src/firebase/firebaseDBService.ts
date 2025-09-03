import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore'
import {auth, db} from "../configurations/firebase-config";
import {ADMIN_EMAILS, type TestRecord} from "../utils/User.ts";
import type {
    MultiLangString,
    QuizData,
    QuizQuestion,
    SignupData
} from "../utils/quiz-types.ts";


const quizzesColl = collection(db, "quiz_collection");

export const createUserInDb = async (userDto: SignupData) => {
    console.log('🔥 Создаем пользователя в Firestore');
    console.log('📝 Данные:', userDto);

    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Пользователь не аутентифицирован');
        }

        const displayName = `${userDto.first_name} ${userDto.last_name}`.trim();

        const newUser = {
            uid: currentUser.uid,
            displayName,
            email: userDto.email,
            testList: []
        };

        console.log('📤 Сохраняем данные:', newUser);
        console.log('📍 В документ с ID:', newUser.uid);

        await setDoc(doc(db, "users", newUser.uid), newUser);
        console.log('✅ Пользователь успешно создан в Firestore!');

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

        const newTestRecord: TestRecord = {
            idTest,
            title: getTestTitle(idTest),
            score: scoreString,
            completed: true
        };

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const updatedTests = userData.testList || [];

            const existingTestIndex = updatedTests.findIndex((test: TestRecord) => test.idTest === idTest);

            if (existingTestIndex >= 0) {
                updatedTests[existingTestIndex] = newTestRecord;
            } else {
                updatedTests.push(newTestRecord);
            }

            await updateDoc(userRef, {testList: updatedTests});
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
        if (!uid || !testId) {
            console.warn('canTakeTest: отсутствует uid или testId');
            return true;
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const test = userData.testList?.find((t: TestRecord) => t.idTest === testId);
            return test ? !test.completed : true; // Если тест найден, проверяем completed, иначе разрешаем
        }

        return true;
    } catch (error) {
        console.error('Ошибка при проверке доступности теста:', error);
        return true;
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

const isMulti = (v: any): v is MultiLangString =>
    v && typeof v.ru === "string" && typeof v.he === "string";

function validateQuestion(q: QuizQuestion, idx: number) {
    if (!isMulti(q.question)) throw new Error(`Вопрос #${idx}: поле "question" должно быть {ru, he}`);
    if (!q.options || !Array.isArray(q.options.ru) || !Array.isArray(q.options.he)) {
        throw new Error(`Вопрос #${idx}: options.ru/he должны быть массивами`);
    }
    if (q.options.ru.length !== q.options.he.length) {
        throw new Error(`Вопрос #${idx}: длина options.ru и options.he должна совпадать`);
    }
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.ru.length) {
        throw new Error(`Вопрос #${idx}: некорректный индекс answer`);
    }
}

function validateQuiz(quiz: QuizData) {
    if (!quiz?.id) throw new Error("quiz.id обязателен");
    if (!isMulti(quiz.title)) throw new Error("quiz.title должен быть {ru, he}");
    if (!isMulti(quiz.description)) throw new Error("quiz.description должен быть {ru, he}");
    (quiz.questions ?? []).forEach(validateQuestion);
}

export const createQuiz = async (quiz: QuizData, {overwrite = false} = {}) => {
    try {
        const email = auth.currentUser?.email || "";
        if (!email) throw new Error("Не авторизован");
        if (!ADMIN_EMAILS.has(email)) throw new Error("Нет прав (не админ)");

        validateQuiz(quiz);

        const quizRef = doc(quizzesColl, quiz.id);
        const snap = await getDoc(quizRef);

        // Проверяем существование документа по ID
        if (snap.exists() && !overwrite) {
            console.log(`⏭️ Квиз "${quiz.id}" уже существует, пропускаем`);
            return {
                id: quiz.id,
                status: "skipped" as const,
                reason: "already_exists",
                data: snap.data() as QuizData
            };
        }

        // Создаем объект, который точно соответствует типу QuizData
        const newQuiz: QuizData = {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            icon: quiz.icon || `image/${quiz.id}.png`,
            questions: quiz.questions || [],
            // createdAt: new Date().toISOString(),
            // updatedAt: new Date().toISOString(),
        };

        console.log('📤 Сохраняем новый квиз:', newQuiz);
        console.log('📍 В документ с ID:', newQuiz.id);

        // Сохраняем квиз (используем merge: false, чтобы полностью перезаписать при overwrite)
        await setDoc(quizRef, newQuiz, { merge: false });
        console.log('✅ Квиз успешно создан в Firestore!');

        // Проверка сохранения
        const savedDoc = await getDoc(quizRef);
        if (savedDoc.exists()) {
            console.log('✅ Подтверждение: данные сохранены');
            console.log('📄 Сохраненные данные:', savedDoc.data());
        } else {
            console.error('❌ Данные не найдены после сохранения');
        }

        return {
            ...newQuiz,
            status: "created" as const
        };
    } catch (error) {
        console.error('❌ Ошибка при создании quiz:', error);
        throw error;
    }
};

// Функция для получения всех существующих ID квизов
const getExistingQuizIds = async (): Promise<Set<string>> => {
    try {
        const querySnapshot = await getDocs(quizzesColl);
        const existingIds = new Set<string>();

        querySnapshot.docs.forEach(doc => {
            existingIds.add(doc.id);
        });

        console.log('📋 Найдены существующие квизы:', Array.from(existingIds));
        return existingIds;
    } catch (error) {
        console.error('❌ Ошибка при получении существующих квизов:', error);
        return new Set();
    }
};

// Улучшенная функция для массового создания уникальных квизов
export const createUniqueQuizzes = async (quizzes: QuizData[], options = { overwrite: false }) => {
    const results = {
        created: [] as QuizData[],
        skipped: [] as { id: string; reason: string }[],
        errors: [] as { id: string; error: string }[]
    };

    console.log(`🚀 Начинаем создание ${quizzes.length} квизов...`);
    console.log(`🔧 Режим overwrite: ${options.overwrite}`);

    // Получаем список существующих квизов один раз
    const existingIds = await getExistingQuizIds();

    for (const quiz of quizzes) {
        try {
            // Проверяем существование ДО вызова createQuiz
            if (existingIds.has(quiz.id)) {
                console.log(`⏭️ Квиз "${quiz.id}" уже существует, пропускаем`);
                results.skipped.push({
                    id: quiz.id,
                    reason: "already_exists"
                });
                continue;
            }

            const result = await createQuiz(quiz, options);

            if (result.status === "created") {
                results.created.push(result);
                console.log(`✅ Создан квиз: ${quiz.id}`);
                // Добавляем в список существующих для следующих итераций
                existingIds.add(quiz.id);
            } else {
                results.skipped.push({
                    id: quiz.id,
                    reason: result.reason || "unknown"
                });
                console.log(`⏭️ Пропущен квиз: ${quiz.id} (${result.reason})`);
            }
        } catch (error) {
            results.errors.push({
                id: quiz.id,
                error: error instanceof Error ? error.message : String(error)
            });
            console.error(`❌ Ошибка при создании квиза ${quiz.id}:`, error);
        }
    }

    console.log(`📊 Результат: создано ${results.created.length}, пропущено ${results.skipped.length}, ошибок ${results.errors.length}`);

    return results;
};

// Функция для принудительного обновления всех квизов
export const forceUpdateAllQuizzes = async (quizzes: QuizData[]) => {
    console.log('🔄 Принудительное обновление всех квизов...');
    return await createUniqueQuizzes(quizzes, { overwrite: true });
};

// Функция для очистки всех квизов (для разработки)
export const clearAllQuizzes = async () => {
    try {
        const email = auth.currentUser?.email || "";
        if (!email) throw new Error("Не авторизован");
        if (!ADMIN_EMAILS.has(email)) throw new Error("Нет прав (не админ)");

        const querySnapshot = await getDocs(quizzesColl);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));

        await Promise.all(deletePromises);
        console.log(`🗑️ Удалено ${deletePromises.length} квизов`);

        return { deleted: deletePromises.length };
    } catch (error) {
        console.error('❌ Ошибка при очистке квизов:', error);
        throw error;
    }
};
export const addQuestionsToQuiz = async (quizId: string, items: QuizQuestion[]) => {

    const quizRef = doc(db, "quiz_collection", quizId);
    const quizSnap = await getDoc(quizRef)

    if (quizSnap.exists()) {
        const prev: QuizQuestion[] = Array.isArray(quizSnap.data().questions) ? quizSnap.data().questions : [];
        const next = [...prev, ...items];

        await setDoc(quizRef, { questions: next }, { merge: true });
        console.log("✅ Questions appended");
        return true;
    } else {
        console.error(`❌ Quiz didn't found:`, quizId);
        throw new Error("Quiz didn't found");
    }
}

export const getQuizzes = async (quizzesColl: string): Promise<QuizData[]> => {
    const snap = await getDocs(collection(db, quizzesColl));
    return snap.docs.map(d => d.data() as QuizData);
};

export const getQuizById = async (quizId: string): Promise<QuizData | null> => {
    const quizRef = doc(db, "quiz_collection", quizId);
    const snap = await getDoc(quizRef);

    if (snap.exists()) {
        return snap.data() as QuizData;
    }
    return null;
};

export const removeQuiz = async (quizId: string) => {
    const ref = doc(quizzesColl, quizId);
    const removed = await getDoc(ref);
    console.log(removed.data());
    await deleteDoc(ref);
    return removed;
}