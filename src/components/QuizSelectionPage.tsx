
import { useNavigate } from 'react-router-dom';
import '../styles/QuizSelectionPage.css';
import {quizzes} from "../utils/quiz-types.ts";
import {QuizBlock} from "./QuizBlock.tsx";


const QuizSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    navigate(`/quiz/${id}`);
  };

  return (
      <div className="quiz-selection-container">
        <div className="selection-header">
          <h1>Выберите тест</h1>
        </div>
          <div className="quiz-categories">
            {quizzes.map((quiz) => (
                <QuizBlock key={quiz.id} quiz={quiz} onClick={handleSelect}/>
            ))}
          </div>

      </div>
  );
};

export default QuizSelectionPage;
