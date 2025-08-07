import type {QuizData} from "../utils/quiz-types.ts";

type Props = {
    quiz: QuizData,
    onClick: (id: string) => void,
    lang: 'ru' | 'he';
}

export const QuizBlockLang = (props: Props) => {
    return (
        <div
            className="quiz-card"
            onClick={() => props.onClick(props.quiz.id)}
        >
            <img
                src={`${import.meta.env.BASE_URL}${props.quiz.icon}`}
                alt={props.quiz.title[props.lang]}
                className="quiz-icon"
            />
            <h2>{props.quiz.title[props.lang]}</h2>
            <p className="quiz-description">{props.quiz.description[props.lang]}</p>
        </div>
    );
};

