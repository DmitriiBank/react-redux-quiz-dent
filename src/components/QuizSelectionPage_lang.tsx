import {useNavigate} from 'react-router-dom';
import '../styles/QuizSelectionPage.css';
//import {quizzes} from "../utils/quiz-types.ts";
// import {QuizBlock} from "./QuizBlock.tsx";
// import {useSelector} from "react-redux";
// import type {RootState} from "../redux/store.ts";
import {QuizBlockLang} from "./QuizBlock_lang.tsx";
import {quizzesLang} from "../utils/quiz-types-multilang-full.ts";
//import type {QuizData} from "../utils/quiz-types.ts";




const QuizSelectionPageLang = ({ lang }: { lang: 'ru' | 'he' }) => {
    const navigate = useNavigate();
    // const lang = useSelector((state: RootState) => state.lang.language);

    const handleSelect = (id: string) => {
        navigate(`/quiz/${id}`);
    };

    return (
        <div className="quiz-selection-container">
            <div className="selection-header">
                <h1>{lang === 'ru' ? 'Выберите тест' : 'בחר מבחן'}</h1>
            </div>
            <div className="quiz-categories">
                {quizzesLang.map((quiz) => (
                    <QuizBlockLang
                        key={quiz.id}
                        quiz={quiz}
                        onClick={handleSelect}
                        lang={lang}
                    />
                ))}
            </div>

        </div>
    );
};

export default QuizSelectionPageLang;
