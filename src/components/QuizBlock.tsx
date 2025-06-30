import type {QuizData} from "../utils/quiz-types.ts";

type Props = {
    quiz: QuizData,
    onClick: (id: string) => void
}

export const QuizBlock = (props: Props) => {
    return (
        <div
            className="quiz-card"
            onClick={() => props.onClick(props.quiz.id)}
        >
            <img
                src={props.quiz.icon}
                alt={props.quiz.title}
                className="quiz-icon"
            />
            <h2>{props.quiz.title}</h2>
            <p className="quiz-description">{props.quiz.description}</p>
        </div>
    );
};

