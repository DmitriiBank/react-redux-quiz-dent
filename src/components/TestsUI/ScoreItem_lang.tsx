import type {QuizQuestion} from "../../utils/quiz-types.ts";
import {ImageItem} from "./ImageItem.tsx";

type Props = {
    quiz: QuizQuestion;
    answer: number | null;
    lang: 'ru' | 'he';
};

export const ScoreItemLang = ({quiz, answer, lang}: Props) => {
    const statusLabel = answer === quiz.answer
        ? lang === 'ru' ? 'верно' : 'נכון'
        : lang === 'ru' ? 'ошибка' : 'טעות';

    return (
        <div>
            <div className="quiz-score">
                <div className="quiz-score__header">
                    <strong>{quiz.question[lang]}</strong>
                    <span
                        className={`quiz-score__badge ${
                            answer === quiz.answer
                                ? 'quiz-score__badge--correct'
                                : 'quiz-score__badge--incorrect'
                        }`}
                    >  {statusLabel}
                    </span>
                </div>
                {quiz.image && <ImageItem image={quiz.image} />}
                <ul className="quiz-score__options">
                    {quiz.options[lang].map((opt, idx) => {
                        let optionClass = 'quiz-score__option';
                        if (idx === quiz.answer) {
                            optionClass += ' quiz-score__option--correct';
                        } else if (idx === answer) {
                            optionClass += ' quiz-score__option--incorrect';
                        }

                        return (
                            <li
                                key={idx}
                                className={optionClass}
                            >
                                {opt}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};