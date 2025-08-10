import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { QuizData } from '../utils/quiz-types.ts';
import QuizAppLang from "./QuizApp_lang";
import '../styles/style.css';
import {useSelector} from "react-redux";
import type {RootState} from "../redux/store.ts";


const QuizPageLang = () => {
    const lang = useSelector((state: RootState) => state.lang.language);
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}quiz/${quizId}.json`)
            .then((res) => {
                if (!res.ok) throw new Error('Document not found');
                return res.json();
            })
            .then((data: QuizData) => {
                setQuiz(data);
                setLoading(false);
            })
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
            <h2>{quiz.title[lang]}: {quiz.description[lang]}</h2>
            <QuizAppLang questions={quiz.questions ?? []}/>

        </div>
    );
};

export default QuizPageLang;
