import type {QuizData} from "../utils/quiz-types.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../redux/store.ts";

type Props = {
    quiz: QuizData,
    onClick: (id: string) => void,
    isCompleted: boolean,
    score?: string | null
}

export const QuizBlockLang = ({ quiz, onClick, isCompleted, score }: Props) => {
    const lang = useSelector((state: RootState) => state.lang.language);

    return (
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
                {isCompleted ? (
                    <div className="completed-badge">
                        <div className="status-text">
                            {lang === 'ru' ? '✓ Пройден' : '✓ הושלם'}
                        </div>
                        {score && (
                            <div className="score-text">
                                {lang === 'ru' ? 'Результат: ' : 'תוצאה: '}{score}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="available-badge">
                        {lang === 'ru' ? 'Доступен' : 'זמין'}
                    </div>
                )}
            </div>

            {/* Overlay для заблокированных тестов */}
            {isCompleted && (
                <div className="completed-overlay">
                    <div className="overlay-content">
                        <span className="check-mark">✓</span>
                        <p>{lang === 'ru' ? 'Уже пройден' : 'כבר הושלם'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};