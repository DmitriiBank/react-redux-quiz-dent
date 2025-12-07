import {useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import type {RootState} from "../../redux/store.ts";
import {
    addQuestionsToQuiz, createUniqueQuizzes,
} from "../../firebase/firebaseDBService.ts";
import {ADMIN_EMAILS} from "../../utils/User.ts";
import {useMemo, useState} from "react";
import quizzes from "../../configurations/quiz-config.json";
import questions from "../../configurations/questions/lesson7.json"


export const Navbar = () => {
    const {email, displayName} = useAppSelector(state => state.auth);
    console.log(email, displayName)
    const navigate = useNavigate()
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const isAdmin = useMemo(() => ADMIN_EMAILS.has(email || ""), [email]);
    const [loadingImport, setLoadingImport] = useState(false);

    // const newQuestion = {
    //     "questions": [
    //         {
    //             "question": {
    //                 "ru": "Что изображено под цифрой 4",
    //                 "he": "מה מוצג ליד המספר 4"
    //             },
    //             "image": "image/jaws2.jpg",
    //             "options": {
    //                 "ru": [
    //                     "твердое нёбо",
    //                     "мягкое нёбо",
    //                     "миндалина",
    //                     "нёбно-язычная дужка"
    //                 ],
    //                 "he": [
    //                     "חיך קשה",
    //                     "חיך רך",
    //                     "שקד",
    //                     "קשת חיכית-לשונית"
    //                 ]
    //             },
    //             "answer": 2
    //         }
    //     ]
    // }

    // const data = { questions: lesson1 };

    return (
        <div className={"navbar"}>
            <h3>Навигация</h3>
            <button
                onClick={() => navigate('/')}
            >
                {lang === 'ru' ? 'Тесты' : 'מבחנים'}
            </button>
            <button
                onClick={() => navigate('/lectures')}
            >
                {lang === 'ru' ? 'Лекции' : 'רצאות'}
            </button>
            <button
                onClick={() => navigate('/anatomy')}
            >
                {lang === 'ru' ? 'Анатомия' : 'אנטומיה'}
            </button>
            <button
                onClick={() => navigate('/options')}
            >
                {lang === 'ru' ? 'Настройки' : 'הגדרות'}
            </button>
            {isAdmin && (
                <div>

                    <button
                        disabled={loadingImport}
                        onClick={async () => {
                            console.log("isAdmin ", isAdmin);
                            try {
                                setLoadingImport(true);
                                await createUniqueQuizzes(quizzes, {overwrite: true});
                                alert('Импорт завершён');
                            } catch (e) {
                                console.error(e);
                                alert(`Импорт не выполнен`);
                            } finally {
                                setLoadingImport(false);
                            }
                        }}
                    >
                        {loadingImport ? 'Импорт…' : 'Импорт лекций в БД'}
                    </button>
                    <button
                        disabled={loadingImport}
                        onClick={async () => {
                            console.log("isAdmin ", isAdmin);
                            try {
                                setLoadingImport(true);
                                await addQuestionsToQuiz("lesson7", questions.questions);
                                alert('Импорт завершён');
                            } catch (e) {
                                console.error(e);
                                alert(`Импорт не выполнен`);
                            } finally {
                                setLoadingImport(false);
                            }
                        }}
                    >
                        {loadingImport ? 'Импорт…' : 'Импорт вопроса в БД'}
                    </button>
                </div>
            )}
        </div>
    );
}
    ;

