import { useState } from 'react';
import '../styles/style.css';
import type { QuizQuestion } from "../utils/quiz-types.ts";
import {ScorePage} from "./ScorePage.tsx";
import {ProgressBar} from "./ProgressBar.tsx";
import {AnswersList} from "./AnswersList.tsx";

const QuizApp = ({ questions }: { questions: QuizQuestion[]}) => {
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
        <ScorePage
            questions={questions}
            score={score}
            answers={answers}
            onClick={restart}
             />
    )
  }

  const q = questions[current];

  return (
      <div className="quiz-container">
        <div className="question">
          <div className="question-text">
            {current + 1}. {q.question}
          </div>
          {q.image && (
              <div className="question-image-container">
                <img src={import.meta.env.BASE_URL  + q.image} alt="вопрос" className="question-image" />
              </div>
          )}
            {q.iframe && (
                <iframe
                    src={q.iframe}
                    width="100%"
                    height="600"
                    allowFullScreen
                    style={{ border: "none", marginBottom: "20px" }}
                />
            )}

          <AnswersList
              options={q.options}
              onClick={handleAnswer}
              selected={selected}/>

          <div className="buttons-container">
            <button
                id="next-btn"
                className={selected !== null ? 'answer-mode' : ''}
                onClick={handleNext}
                disabled={selected === null}
            >
              {current + 1 === questions.length ? 'Показать результат' : 'Ответить'}
            </button>
          </div>

          <ProgressBar currentQuestion={current + 1} questionsLength={questions.length}/>
        </div>
      </div>
  );
};

export default QuizApp;
