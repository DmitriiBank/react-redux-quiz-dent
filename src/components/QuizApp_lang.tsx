import {useState} from 'react';
import '../styles/style.css';
import type {QuizQuestion} from "../utils/quiz-types.ts";
// import { ScorePage } from "./ScorePage.tsx";
import {ProgressBar} from "./progressBar/ProgressBar.tsx";
import {AnswersList} from "./AnswersList.tsx";
import {ScorePageLang} from "./ScorePage_lang.tsx";

const QuizAppLang = ({questions, lang}: {
    questions: QuizQuestion[],
    lang: 'ru' | 'he'
}) => {
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>([]);


    const handleAnswer = (index: number) => {
        setSelected(index);
    };

    const handleNext = () => {
        const isCorrect = selected === questions[current].answer;
        if (isCorrect) setScore((prev) => prev + 1);
        setAnswers((prev) => [...prev, selected]);

        if (current + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrent((prev) => prev + 1);
        }

        setSelected(null);
    };

    const restart = () => {
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setAnswers([]);
        setFinished(false);
    };

    if (finished) {
        return (
            <ScorePageLang
                questions={questions}
                score={score}
                answers={answers}
                onClick={restart}
                lang={lang}
            />
        );
    }

    const q = questions[current];

    return (
        <div className="quiz-container">
            <div className="question">
                <div className="question-text">{q.question[lang]}</div>
                {q.image && (
                    <div className="question-image-container">
                        <img
                            src={import.meta.env.BASE_URL + q.image}
                            alt="question"
                            className="question-image"
                        />
                    </div>
                )}
                <AnswersList
                    options={q.options}
                    selected={selected}
                    onClick={handleAnswer}
                    lang={lang}
                />
            </div>
            <button
                className="next-button"
                onClick={handleNext}
                disabled={selected === null}
            >
                {lang === 'ru' ? 'Далее' : 'הבא'}
            </button>
            <ProgressBar
                currentQuestion={current + 1}
                questionsLength={questions.length}
            />
        </div>
    );
};

export default QuizAppLang;