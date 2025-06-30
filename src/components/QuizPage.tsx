import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizApp from './QuizApp';
import type { QuizData } from '../utils/quiz-types.ts'; // путь подкорректируй под проект

const QuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}quiz/${quizId}.json`)
            .then((res) => {
                if (!res.ok) throw new Error('Файл не найден');
                return res.json();
            })
            .then((data: QuizData) => {
                setQuiz(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Ошибка загрузки теста:', err);
                setQuiz(null);
                setLoading(false);
            });
    }, [quizId]);

    if (loading) return <p>Загрузка...</p>;
    if (!quiz) return <p>Тест не найден</p>;

    return (
        <div className="quiz-page">
            <h2>{quiz.title}: {quiz.description}</h2>
            <QuizApp questions={quiz.questions ?? []} />
        </div>
    );
};

export default QuizPage;
