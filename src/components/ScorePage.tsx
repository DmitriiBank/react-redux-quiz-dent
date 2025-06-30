import {ScoreItem} from "./ScoreItem.tsx";
import type {QuizQuestion} from "../utils/quiz-types.ts";

type Props = {
    questions: QuizQuestion[];
    score: number;
    answers: (number | null)[];
    onClick: () => void;
}
export const ScorePage = ({questions, score, answers, onClick}: Props) => {
    return (
        <div className="results-container">
            <h2 className="results-title">Результат</h2>
            <div className="results-summary">
                Вы ответили правильно на {score} из {questions.length} вопросов.
            </div>
            <ul className="answers-list">
                {questions.map((q, idx) => (
                    <li
                        key={idx}
                        className={`answer-item ${
                            answers[idx] === q.answer ? 'correct' : 'incorrect'
                        }`}
                    >
                        <ScoreItem quiz={q} answer={answers[idx]}/>
                    </li>
                ))}
            </ul>
            <button className="restart-button" onClick={onClick}>
                Пройти заново
            </button>
        </div>
    );
};

