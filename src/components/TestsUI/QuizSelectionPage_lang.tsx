import {useNavigate} from 'react-router-dom';
import '../../styles/QuizSelectionPage.css';
import {QuizBlockLang} from "./QuizBlock_lang.tsx";
//import {quizzesLang} from "../../utils/quiz-types-multilang-full.ts";
import type {RootState} from "../../redux/store.ts";
import {
    canTakeTest,
    getQuizzes,
    getUserData
} from "../../firebase/firebaseDBService.ts";
import {useEffect, useState} from "react";
import type {TestRecord} from "../../utils/User.ts";
import {useAppSelector} from "../../redux/hooks.ts";
import type {QuizData} from "../../utils/quiz-types.ts";




const QuizSelectionPageLang = () => {
    const navigate = useNavigate();
    const lang = useAppSelector((state: RootState) => state.lang.language);
    const uid = useAppSelector((state: RootState) => state.auth.uid);
    const [testStatus, setTestStatus] = useState<Record<string, {
        canTake: boolean,
        score?: string | null
    }>>({});
    // const [loading, setLoading] = useState(false);
    // const setLoading = useSelector((state: RootState) => state.auth.isLoading);
    const [quizzes, setQizzes] = useState<QuizData[]>([])


    useEffect(() => {
        let alive = true;

        (async () => {
            const [userData, qs] = await Promise.all([
                uid ? getUserData(uid) : Promise.resolve(null),
                getQuizzes("quiz_collection"),
            ]);
            if (!alive) return;

            setQizzes(qs);

            if (!uid || !userData) {
                const map: Record<string, { canTake: boolean }> = {};
                qs.forEach(q => map[q.id] = { canTake: true });
                setTestStatus(map);
                return;
            }
            const testList = (userData?.testList ?? []) as TestRecord[];

            const scores = new Map<string, TestRecord>(testList.map(
                (t: TestRecord) => [t.idTest, t]
            ))

            const can = await Promise.all(
                qs.map((q) => canTakeTest(uid, q.id).catch(() => true))
            );

            const map: Record<string, { canTake: boolean; score?: string | null }> = {};
            qs.forEach((q, i) => {
                map[q.id] = { canTake: can[i], score: scores.get(q.id)?.score ?? null};
            });
            setTestStatus(map);
        })();

        return () => { alive = false; };
    }, [uid]);

    const handleSelect = (id: string) => navigate(`/quiz/${id}`);

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
                {/*{quizzesLang.map((quiz) => {*/}
                    {quizzes.map((quiz) => {
                    const status = testStatus[quiz.id]; // может быть undefined, и это ок
                    const isCompleted = status ? !status.canTake : undefined;
                    return (
                        <QuizBlockLang
                            key={quiz.id}
                            quiz={quiz}
                            onClick={handleSelect}
                            isCompleted={isCompleted}
                            score={status?.score}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelectionPageLang;