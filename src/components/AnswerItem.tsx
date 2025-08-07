import type {MultiLangString} from "../utils/quiz-types.ts";

type Props ={
    className: string
    answer: MultiLangString;
    onClick: () => void;
    lang: 'ru' | 'he'
}
export const AnswerItem = ({className, answer, onClick, lang}:Props) => {
    return (
        <div
            className={className}
            onClick={onClick}
        >
            {answer[lang]}
        </div>
    );
};

