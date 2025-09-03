import type { QuizQuestion } from "../../utils/quiz-types.ts";
import {ImageItem} from "./ImageItem.tsx";

type Props = {
    quiz: QuizQuestion;
    answer: number | null;
    lang: 'ru' | 'he';
};

export const ScoreItemLang = ({ quiz, answer, lang }: Props) => {
    const statusLabel = answer === quiz.answer
        ? lang === 'ru' ? 'верно' : 'נכון'
        : lang === 'ru' ? 'ошибка' : 'טעות';

    return (
        <div>
            <div>
                <div className="question-header">
                    <strong>{quiz.question[lang]}</strong>
                    <span className={`status-badge ${answer === quiz.answer ? 'correct' : 'incorrect'}`}>
                        {statusLabel}
                    </span>
                </div>
                {quiz.image && <ImageItem image={quiz.image}/>}
                <ul className="answer-options">
                    {quiz.options[lang].map((opt, idx) => (
                        <li
                            key={idx}
                            className={`option ${
                                idx === quiz.answer
                                    ? 'correct'
                                    : idx === answer
                                    ? 'incorrect'
                                    : ''
                            }`}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};