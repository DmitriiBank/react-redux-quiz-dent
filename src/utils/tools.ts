import type {SignupData} from "./quiz-types.ts";
import {auth} from "../configurations/firebase-config.ts";

export const convertUserDtoToUser = async (dto: SignupData) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error('Пользователь не аутентифицирован');
    }

    const displayName = `${dto.first_name} ${dto.last_name}`.trim();
    return {
        uid: currentUser.uid, // Используем реальный UID из Firebase Auth
        displayName,
        email: dto.email,
        testList: [] // Инициализируем пустым массивом
    }
}