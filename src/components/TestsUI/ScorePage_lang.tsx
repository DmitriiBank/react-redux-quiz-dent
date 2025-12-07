// import { ScoreItem } from "./ScoreItem.tsx";
import type {QuizQuestion} from "../../utils/quiz-types.ts";
import {ScoreItemLang} from "./ScoreItem_lang.tsx";
import type {RootState} from "../../redux/store.ts";
import {useAppSelector} from "../../redux/hooks.ts";

type Props = {
    questions: QuizQuestion[];
    score: number;
    answers: (number | null)[];
    onClick: () => void;
};

export const ScorePageLang = ({questions, score, answers, onClick}: Props) => {
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const title = lang === 'ru' ? 'Результат' : 'תוצאה';
    const summary =
        lang === 'ru'
            ? `Вы ответили правильно на ${score} из ${questions.length} вопросов.`
            : `ענית נכון על ${score} מתוך ${questions.length} שאלות.`;
    const button = lang === 'ru' ? 'Вернуться к выбору теста' : 'חזרה לבחירת המבחן';
    return (
        <div className="quiz-results">
            <h2 className="quiz-results__title">{title}</h2>
            <div className="quiz-results__summary">{summary}</div>
            <ul className="quiz-results__answers">
                {questions.map((q, idx) => {
                    const answerClass = answers[idx] === q.answer
                        ? `quiz-results__answer--correct`
                        : `quiz-results__answer--incorrect`;
                    return (
                        <li
                            key={`${q.question}-${idx}`}
                            className={`quiz-results__answer ${answerClass}`}
                        >
                            <ScoreItemLang
                                quiz={q}
                                answer={answers[idx]}
                                lang={lang}                            />
                        </li>
                    )
                })}
            </ul>
            <button
                className="quiz-results__restart"
                onClick={onClick}
            >
                {button}
            </button>
        </div>
    );
};