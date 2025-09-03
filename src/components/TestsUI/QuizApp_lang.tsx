import {useEffect, useState} from 'react';
import '../../styles/style.css';
import type {QuizQuestion} from "../../utils/quiz-types.ts";
import {ProgressBar} from "../progressBar/ProgressBar.tsx";
import {AnswersList} from "./AnswersList.tsx";
import {ScorePageLang} from "./ScorePage_lang.tsx";
import {useNavigate, useParams} from 'react-router-dom';
import {useAppSelector} from '../../redux/hooks.ts';
import type {RootState} from "../../redux/store.ts";
import {canTakeTest, saveTestResult} from "../../firebase/firebaseDBService.ts";
import {ImageItem} from "./ImageItem.tsx";

const QuizAppLang = ({questions}: {
    questions: QuizQuestion[],
}) => {
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { uid, testList } = useAppSelector((state) => state.auth);

    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [saving, setSaving] = useState(false);
    const [canTake, setCanTake] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    // Получаем название теста из массива testList (закомментировано, если не используется)
    // const currentTest = testList?.find(test => test.idTest === quizId);
    // const testTitle = currentTest?.title || `${quizId}`;

    useEffect(() => {
        const checkTestAvailability = async () => {
            if (!uid || !quizId) {
                console.log('Гостевой режим - все тесты не доступны');
                return;
            }

            try {
                const canTakeResult = await canTakeTest(uid, quizId);
                setCanTake(canTakeResult);
            } catch (error) {
                console.error("Ошибка при проверке доступности теста:", error);
                setCanTake(true);
            } finally {
                setLoading(false);
            }
        };

        checkTestAvailability();
    }, [uid, quizId]);

    const handleAnswer = (index: number) => {
        setSelected(index);
    };

    const handleNext = async () => {
        const isCorrect = selected === questions[current].answer;
        if (isCorrect) setScore((prev) => prev + 1);

        const newAnswers = [...answers, selected];
        setAnswers(newAnswers);

        if (current + 1 >= questions.length) {
            setFinished(true);

            // Сохраняем результат в Firebase только для аутентифицированных пользователей
            if (uid && quizId) {
                setSaving(true);
                try {
                    const finalScore = isCorrect ? score + 1 : score;
                    await saveTestResult(uid, quizId, finalScore, questions.length);
                    console.log('✅ Результат теста сохранен');
                } catch (error) {
                    console.error("❌ Ошибка при сохранении результата:", error);
                     } finally {
                    setSaving(false);
                }
            }
        } else {
            setCurrent((prev) => prev + 1);
        }

        setSelected(null);
    };

    const handleBackToSelection = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="loading-ring"></div>
        );
    }

    if (uid && canTake === false) {
        const completedTest = testList?.find(test => test.idTest === quizId);
        return (
            <div className="test-already-completed">
                <div className="completed-message">
                    <h2>{lang === 'ru' ? 'Тест уже пройден!' : 'המבחן כבר הושלם!'}</h2>
                    <div className="test-info">
                        {completedTest?.score && (
                            <p className="result">
                                {lang === 'ru' ? 'Ваш результат: ' : 'התוצאה שלך: '}
                                <strong>{completedTest.score}</strong>
                            </p>
                        )}
                    </div>
                    <button
                        className="back-button"
                        onClick={handleBackToSelection}
                    >
                        {lang === 'ru' ? 'Вернуться к выбору тестов' : 'חזרה לבחירת מבחנים'}
                    </button>
                </div>
            </div>
        );
    }

    if (finished) {
        return (
            <div>
                {saving && (
                    <div className="saving-indicator">
                        {lang === 'ru' ? 'Сохранение результата...' : 'שומר תוצאה...'}
                    </div>
                )}
                <ScorePageLang
                    questions={questions}
                    score={score}
                    answers={answers}
                    onClick={handleBackToSelection}
                />
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="error-container">
                <h2>{lang === 'ru' ? 'Ошибка загрузки теста' : 'שגיאה בטעינת המבחן'}</h2>
                <p>{lang === 'ru' ? 'Вопросы не найдены' : 'שאלות לא נמצאו'}</p>
                <button className="back-button" onClick={handleBackToSelection}>
                    {lang === 'ru' ? 'Вернуться назад' : 'חזרה'}
                </button>
            </div>
        );
    }

    const q = questions[current];

    if (!q || !q.question) {
        return (
            <div className="error-container">
                <h2>{lang === 'ru' ? 'Ошибка' : 'שגיאה'}</h2>
                <p>{lang === 'ru' ? 'Некорректные данные вопроса' : 'נתוני שאלה שגויים'}</p>
                <button className="back-button" onClick={handleBackToSelection}>
                    {lang === 'ru' ? 'Вернуться назад' : 'חזרה'}
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="question">
                <div className="question-text">
                    {q.question[lang]}
                </div>
                {q.image && <ImageItem image={q.image}/>}
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
                {current + 1 >= questions.length
                    ? (lang === 'ru' ? 'Завершить тест' : 'סיים מבחן')
                    : (lang === 'ru' ? 'Далее' : 'הבא')
                }
            </button>
            <ProgressBar
                currentQuestion={current + 1}
                questionsLength={questions.length}
            />
        </div>
    );
};

export default QuizAppLang;