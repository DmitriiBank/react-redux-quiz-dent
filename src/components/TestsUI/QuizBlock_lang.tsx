import type {QuizData} from "../../utils/quiz-types.ts";
import type {RootState} from "../../redux/store.ts";
import {useAppSelector} from "../../redux/hooks.ts";
import {removeQuiz} from "../../firebase/firebaseDBService.ts";
//import quizzes from "../../configurations/quiz-config.json";
import {useMemo, useState} from "react";
import {ADMIN_EMAILS} from "../../utils/User.ts";

type Props = {
    quiz: QuizData,
    onClick: (id: string) => void,
    isCompleted?: boolean,
    score?: string | null
}

export const QuizBlockLang = ({quiz, onClick, isCompleted, score}: Props) => {
    const {email, uid} = useAppSelector(state => state.auth);
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const isAdmin = useMemo(() => ADMIN_EMAILS.has(email || ""), [email]);
    const [loadingImport, setLoadingImport] = useState(false);


    const statusNode = (() => {
        if (!uid) return (
            <div className="completed-badge">
                {lang === 'ru' ? 'Не доступен' : 'אין זמין'}
            </div>
        );
        if (isCompleted === undefined) {
            return (
                <div className="loading-ring"></div>
            );
        }
        if (isCompleted) {
            return (
                <div className="completed-badge">
                    <div className="status-text">
                        {lang === 'ru' ? '✓ Уже пройден' : 'כבר הושלם ✓'}
                    </div>
                    {score && (
                        <div className="score-text">
                            {lang === 'ru' ? 'Результат: ' : 'תוצאה: '}{score}
                        </div>
                    )}

                </div>
            );
        }
        return (
            <div className="available-badge">
                {lang === 'ru' ? 'Доступен' : 'זמין'}
            </div>
        );
    })();

    return (
        <>
            <div
                className={`quiz-card ${isCompleted ? 'completed' : 'available'}`}
                onClick={() => onClick(quiz.id)}
            >
                <img
                    src={`${import.meta.env.BASE_URL}${quiz.icon}`}
                    alt={quiz.title[lang]}
                    className="quiz-icon"
                />
                <h2>{quiz.title[lang]}</h2>
                <p className="quiz-description">
                    {quiz.description[lang]}
                </p>

                {/* Статус теста */}
                <div className="quiz-status">
                    {statusNode}
                </div>

            </div>
            {isAdmin &&
                <button
                    disabled={loadingImport}
                    onClick={async () => {
                        console.log("isAdmin ", isAdmin);
                        try {
                            await removeQuiz(quiz.id);
                            alert('Quiz was deleted successfully!');
                            setLoadingImport(true);
                            window.location.reload();
                        } catch (e) {
                            console.error(e);
                            alert(`Delete not successfully!`);
                            setLoadingImport(false);
                        }
                    }}
                >
                    {loadingImport ? 'Удаление…' : 'Удаление лекции из БД'}
                </button>}
        </>
    );
};