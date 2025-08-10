import {useNavigate} from 'react-router-dom';
import '../styles/QuizSelectionPage.css';
import {QuizBlockLang} from "./QuizBlock_lang.tsx";
import {quizzesLang} from "../utils/quiz-types-multilang-full.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../redux/store.ts";
import {canTakeTest, getUserData} from "../firebase/firebaseDBService.ts";
import {useEffect, useState} from "react";
import type {TestRecord} from "../utils/User.ts";

const QuizSelectionPageLang = () => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.lang.language);
    const uid = useSelector((state: RootState) => state.auth.uid);
    const [testStatus, setTestStatus] = useState<Record<string, { canTake: boolean, score?: string }>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTestStatus = async () => {
            console.log('loadTestStatus вызван с uid:', uid);

            // Добавляем небольшую задержку для инициализации аутентификации
            await new Promise(resolve => setTimeout(resolve, 100));

            setLoading(true);

            try {
                // Если нет uid, все тесты доступны (гостевой режим)
                if (!uid) {
                    console.log('Гостевой режим - все тесты доступны');
                    const guestStatus: Record<string, { canTake: boolean, score?: string }> = {};
                    quizzesLang.forEach(quiz => {
                        guestStatus[quiz.id] = { canTake: true };
                    });
                    setTestStatus(guestStatus);
                    setLoading(false);
                    return;
                }

                console.log('Аутентифицированный пользователь, загружаем статус тестов...');
                const results: Record<string, { canTake: boolean, score?: string }> = {};

                // Получаем данные пользователя для получения результатов
                const userData = await getUserData(uid);
                console.log('Данные пользователя:', userData);

                for (const quiz of quizzesLang) {
                    try {
                        console.log(`Проверяем тест ${quiz.id} для пользователя ${uid}`);
                        const canTake = await canTakeTest(uid, quiz.id);

                        // Ищем результат теста в данных пользователя
                        const testResult = userData?.testList?.find((test: TestRecord) => test.idTest === quiz.id);

                        results[quiz.id] = {
                            canTake,
                            score: testResult?.score || undefined
                        };

                        console.log(`Тест ${quiz.id}: canTake=${canTake}, score=${testResult?.score}`);
                    } catch (error) {
                        console.error(`Ошибка при проверке теста ${quiz.id}:`, error);
                        // В случае ошибки с конкретным тестом, разрешаем его прохождение
                        results[quiz.id] = { canTake: true };
                    }
                }

                setTestStatus(results);
                console.log('Финальный статус тестов:', results);
            } catch (error) {
                console.error('Ошибка при загрузке статуса тестов:', error);
                // В случае ошибки разрешаем все тесты
                const fallbackStatus: Record<string, { canTake: boolean, score?: string }> = {};
                quizzesLang.forEach(quiz => {
                    fallbackStatus[quiz.id] = { canTake: true };
                });
                setTestStatus(fallbackStatus);
            } finally {
                setLoading(false);
            }
        };

        loadTestStatus();
    }, [uid]);

    const handleSelect = (id: string) => {
        navigate(`/quiz/${id}`);
    };

    if (loading) {
        return (
            <div className="quiz-selection-container">
                <div className="loading-container">
                    <p>{lang === 'ru' ? 'Загрузка тестов...' : 'טוען מבחנים...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-selection-container">
            <div className="selection-header">
                <h1>{lang === 'ru' ? 'Выберите тест' : 'בחר מבחן'}</h1>
                {!uid && (
                    <p className="guest-notice">
                        {lang === 'ru'
                            ? 'Вы проходите тесты как гость. Результаты не будут сохранены.'
                            : 'אתה עושה מבחנים כאורח. התוצאות לא יישמרו.'}
                    </p>
                )}
            </div>
            <div className="quiz-categories">
                {quizzesLang.map((quiz) => {
                    const status = testStatus[quiz.id];
                    return (
                        <QuizBlockLang
                            key={quiz.id}
                            quiz={quiz}
                            onClick={handleSelect}
                            isCompleted={status ? !status.canTake : false} // Инвертируем логику
                            score={status?.score}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelectionPageLang;