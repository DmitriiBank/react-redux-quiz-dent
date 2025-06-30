import type { QuizQuestion} from "../utils/quiz-types.ts";

type Props = {
    quiz: QuizQuestion,
    answer: number | null;
}

export const ScoreItem = ({quiz, answer}: Props) => {
    return (
        <div>
            <div>
                <div className="question-header">
                    <strong>{quiz.question}</strong>
                    <span
                        className={`status-badge ${
                            answer === quiz.answer ? 'correct' : 'incorrect'
                        }`}
                    >
                  {answer === quiz.answer ? 'верно' : 'ошибка'}
                </span>
                </div>
                {quiz.image && (
                    <div className="question-image-container">
                        <img
                            src={import.meta.env.BASE_URL + quiz.image}
                            alt="вопрос"
                            className="question-image"
                        />
                    </div>
                )}
                <div className="answer-comparison">
                    <div className="user-answer">
                        Ваш ответ: { answer != null ? quiz.options[answer] : '—'}
                    </div>
                    <div className="correct-answer">
                        Правильный ответ: {quiz.options[quiz.answer]}
                    </div>
                </div>
            </div>
        </div>
    );
};

