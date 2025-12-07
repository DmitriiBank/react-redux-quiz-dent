import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import type {QuizData} from '../../utils/quiz-types.ts';
import QuizAppLang from "./QuizApp_lang.tsx";
import '../../styles/quiz.css';
import type {RootState} from "../../redux/store.ts";
import {useAppSelector} from "../../redux/hooks.ts";
import {getQuizById} from "../../firebase/firebaseDBService.ts";


const QuizPageLang = () => {
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!quizId)
            return setLoading(true);
        // fetch(`${import.meta.env.BASE_URL}quiz/${quizId}.json`)
        getQuizById(quizId)
            .then((res) => {
                if (!res) throw new Error('Document not found');
                // return res.json();
                setQuiz(res); // res уже объект QuizData
                setLoading(false);
            })
            // .then((data: QuizData) => {
            //     setQuiz(data);
            //     setLoading(false);
            // })
            .catch((err) => {
                console.error('Download error: ', err);
                setQuiz(null);
                setLoading(false);
            });
    }, [quizId]);

    if (loading) return <p>Loading...</p>;
    if (!quiz) return <p>Test not found</p>;

    return (
        <div className="quiz-page">
            <h2 className="quiz-page__title">{quiz.title[lang]}: {quiz.description[lang]}</h2>
            <QuizAppLang questions={quiz.questions ?? []}/>

        </div>
    );
};

export default QuizPageLang;
