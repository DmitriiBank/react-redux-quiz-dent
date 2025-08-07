// import { ScoreItem } from "./ScoreItem.tsx";
import type { QuizQuestion } from "../utils/quiz-types.ts";
import {ScoreItemLang} from "./ScoreItem_lang.tsx";

type Props = {
    questions: QuizQuestion[];
    score: number;
    answers: (number | null)[];
    onClick: () => void;
    lang: 'ru' | 'he';
};

export const ScorePageLang = ({ questions, score, answers, onClick, lang }: Props) => {
    const title = lang === 'ru' ? 'Результат' : 'תוצאה';
    const summary =
        lang === 'ru'
            ? `Вы ответили правильно на ${score} из ${questions.length} вопросов.`
            : `ענית נכון על ${score} מתוך ${questions.length} שאלות.`;
    const button = lang === 'ru' ? 'Пройти ещё раз' : 'נסה שוב';

    return (
        <div className="results-container">
            <h2 className="results-title">{title}</h2>
            <div className="results-summary">{summary}</div>
            <ul className="answers-list">
                {questions.map((q, idx) => (
                    <li
                        key={idx}
                        className={`answer-item ${answers[idx] === q.answer ? 'correct' : 'incorrect'}`}
                    >
                        <ScoreItemLang quiz={q} answer={answers[idx]} lang={lang} />
                    </li>
                ))}
            </ul>
            <button className="restart-button" onClick={onClick}>
                {button}
            </button>
        </div>
    );
};