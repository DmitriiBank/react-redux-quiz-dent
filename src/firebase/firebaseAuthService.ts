
import  {signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {auth} from "../configurations/firebase-config.ts";
import type {LoginData, SignupData} from "../utils/quiz-types.ts";


const loginWithEmail = async (data: LoginData)=> {
    const result = await signInWithEmailAndPassword(auth,data.email, data.password);
    const user = result.user;
    return Promise.resolve({email: user.email, displayName: user.displayName})
}

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(auth.currentUser);
    return Promise.resolve({email: user.email, displayName: user.displayName})
}

export const login = async (data:LoginData) => {
    return data.email === "GOOGLE"? loginWithGoogle() : loginWithEmail(data)
}

export const registerWithEmailAndPassword = async (data:SignupData) => {
    const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = result.user;
    const displayName = `${data.first_name} ${data.last_name}`.trim();
    await updateProfile(user, {
        displayName: displayName
    });
    return Promise.resolve({
        email: user.email || '',
        displayName: displayName
    });
}

export const exit = async () => {
    await signOut(auth);
}