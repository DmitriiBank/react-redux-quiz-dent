import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import {auth} from "../configurations/firebase-config.ts";
import type {LoginData, SignupData} from "../utils/quiz-types.ts";
import {createUserInDb, getUserData} from "./firebaseDBService.ts";

const loginWithEmail = async (data: LoginData) => {
    const result = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = result.user;

    // Получаем данные пользователя из Firestore
    const userData = await getUserData(user.uid);

    return Promise.resolve({
        email: user.email,
        displayName: user.displayName || userData?.displayName,
        uid: user.uid,
        tests: userData?.testList || [] // Исправлено: было tests, должно быть testList
    });
}

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('Google user:', auth.currentUser);

    // Проверяем, существует ли пользователь в Firestore
    let userData = await getUserData(user.uid);

    // Если пользователь новый, создаем запись
    if (!userData) {
        const signupData: SignupData = {
            first_name: user.displayName?.split(' ')[0] || 'User',
            last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            password: '' // Пароль не нужен для Google
        };

        await createUserInDb(signupData);
        userData = await getUserData(user.uid);
    }

    return Promise.resolve({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
        tests: userData?.testList || [] // Исправлено
    });
}

export const login = async (data: LoginData) => {
    return data.email === "GOOGLE" ? loginWithGoogle() : loginWithEmail(data);
}

export const registerWithEmailAndPassword = async (dto: SignupData) => {
    console.log('🚀 Начинаем регистрацию пользователя:', dto);

    try {
        // 1. Создаем пользователя в Firebase Auth
        const result = await createUserWithEmailAndPassword(auth, dto.email, dto.password);
        const displayName = `${dto.first_name} ${dto.last_name}`.trim();

        if (displayName) {
            await updateProfile(result.user, { displayName });
        }

        const user = result.user;
        console.log('✅ Пользователь создан в Firebase Auth:', user.uid);

        // 2. Создаем запись в Firestore
        await createUserInDb(dto);
        console.log('✅ Запись пользователя создана в Firestore');

        // 3. Получаем созданные данные для подтверждения
        const userData = await getUserData(user.uid);

        return Promise.resolve({
            email: user.email || '',
            displayName: displayName,
            uid: user.uid,
            tests: userData?.testList || []
        });

    } catch (error) {
        console.error('❌ Ошибка при регистрации:', error);
        throw error;
    }
}

export const exit = async () => {
    await signOut(auth);
}