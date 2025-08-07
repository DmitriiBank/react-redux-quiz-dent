
import {
    signOut,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import type {LoginData, SignupData} from "../utils/quiz-types.ts";
import {auth} from "../configurations/firebase-config.ts";

const loginWithEmail = async (data: LoginData) => {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    return {
        email: data.email,
        displayName: auth.currentUser?.displayName || ''
    };
}

const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
        email: user.email || '',
        displayName: user.displayName || ''
    };
}

export const login = async (data: LoginData) => {
    return data.email === "GOOGLE" ? loginWithGoogle() : loginWithEmail(data);
}

export const registerWithEmailAndPassword = async (data: SignupData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const displayName = `${data.first_name} ${data.last_name}`.trim();
    if (displayName) {
        await updateProfile(userCredential.user, {
            displayName: displayName
        });
    }
    return {
        email: data.email,
        displayName: displayName
    };
}

export const exit = async () => {
    await signOut(auth);
}