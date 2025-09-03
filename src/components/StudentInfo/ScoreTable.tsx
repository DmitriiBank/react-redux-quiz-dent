import {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import type {GridColDef} from "@mui/x-data-grid/models";
import {Subscription} from "rxjs";
import {getAllStudentInfo, getCurrentUserInfo} from "../../firebase/firebaseStudentInfoService";
import {ADMIN_EMAILS, type User} from "../../utils/User";
import {DeleteIcon, EditIcon} from "lucide-react";
import {useAppSelector} from "../../redux/hooks.ts";
import type {RootState} from "../../redux/store.ts";

type Row = {
    id: string;
    studentName: string;
    lessons: { [key: string]: { score: string; completed: boolean } };
};

export const ScoreTable = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const email = useAppSelector((state: RootState) => state.auth.email);
    const currentUserUid = useAppSelector((state: RootState) => state.auth.uid);

    // Определяем админа на основе email
    const isAdmin = email ? ADMIN_EMAILS.has(email) : false;

    useEffect(() => {
        // Небольшая задержка для инициализации auth данных
        const timer = setTimeout(() => {
            setInitialLoadDone(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Ждем инициализации и наличия базовых данных
        if (!initialLoadDone) {
            return;
        }

        // Если нет ни email ни uid, возможно еще загружается auth
        if (!email && !currentUserUid) {
            // Даем еще немного времени на загрузку
            const timer = setTimeout(() => {
                if (!email && !currentUserUid) {
                    setLoading(false);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }

        setLoading(true);
        let sub: Subscription;

        if (isAdmin) {
            console.log("Загружаем данные для админа");
            // Админ загружает всех пользователей
            sub = getAllStudentInfo().subscribe({
                next: (users: User[]) => {
                    console.log("Получены данные админа:", users.length);
                    const allRows: Row[] = users.map((u) => {
                        const lessons: Row["lessons"] = {};
                        (u.testList ?? []).forEach((t) => {
                            lessons[t.idTest] = {
                                score: t.score ?? "—",
                                completed: !!t.completed
                            };
                        });
                        return {
                            id: u.uid,
                            studentName: u.displayName ?? "",
                            lessons,
                        };
                    });
                    setRows(allRows);
                    setLoading(false);
                },
                error: (error) => {
                    console.error("Ошибка загрузки данных админа:", error);
                    setRows([]);
                    setLoading(false);
                }
            });
        } else if (currentUserUid) {
            console.log("Загружаем данные для пользователя:", currentUserUid);

            sub = getCurrentUserInfo(currentUserUid).subscribe({
                next: (users: User[]) => {
                    console.log("Получены пользовательские данные:", users.length);
                    const allRows: Row[] = users.map((u) => {
                        const lessons: Row["lessons"] = {};
                        (u.testList ?? []).forEach((t) => {
                            lessons[t.idTest] = {
                                score: t.score ?? "—",
                                completed: !!t.completed
                            };
                        });
                        return {
                            id: u.uid,
                            studentName: u.displayName ?? "",
                            lessons,
                        };
                    });
                    setRows(allRows);
                    setLoading(false);
                },
                error: (error) => {
                    console.error("Ошибка загрузки пользовательских данных:", error);
                    setRows([]);
                    setLoading(false);
                }
            });
        } else {
            setRows([]);
            setLoading(false);
        }

        return () => {
            if (sub) {
                console.log("Отписываемся от подписки");
                sub.unsubscribe();
            }
        };
    }, [initialLoadDone, email, currentUserUid, isAdmin]);

    const lessonCols: GridColDef<Row>[] = Array.from({length: 8}, (_, i) => {
        const lessonId = `lesson${i + 1}`;
        return {
            field: lessonId,
            headerName: `Лекция ${i + 1}`,
            width: 120,
            renderCell: (params) => {
                const data = params.row.lessons[lessonId];
                if (!data) return "—";
                return data.completed ? (
                    <Chip
                        label={data.score || "Сдан"}
                        color="success"
                        size="small"
                    />
                ) : (
                    <Chip
                        label="Не сдан"
                        variant="outlined"
                        size="small"
                    />
                );
            },
        };
    });


    const columns: GridColDef<Row>[] = isAdmin ? [
        {field: "studentName", headerName: "Ученик", minWidth: 180, flex: 1},
        ...lessonCols,
        {
            field: "actions",
            headerName: "Действия",
            width: 120,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{display: "flex", gap: 1}}>
                    <EditIcon
                        size={18}
                        color="#666"
                        style={{cursor: "pointer", margin: "2px"}}
                        onClick={() => handleEdit(params.row.id)}
                    />
                    <DeleteIcon
                        size={18}
                        color="#d32f2f"
                        style={{cursor: "pointer", margin: "2px"}}
                        onClick={() => handleDelete(params.row.id)}
                    />
                </Box>
            ),
        },
    ] : lessonCols;

    const handleEdit = (id: string) => {
        console.log("Редактировать", id);
        // здесь можно открыть модалку с редактированием
    };

    const handleDelete = (id: string) => {
        console.log("Удалить", id);
        // здесь запрос на удаление
    };

    // Показываем сообщение о загрузке auth данных
    if (!initialLoadDone) {
        return (
            <Box sx={{ height: "100%", width: "100%", bgcolor: "background.paper", p: 2, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Инициализация...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 2
            }}
        >
            <Typography
                variant="h5"
                sx={{mb: 2}}
            >
                {isAdmin ? "Таблица оценок всех студентов" : "Мои оценки"}
            </Typography>
            <DataGrid
                rows={rows}
                sx={{height: "auto"}}
                getRowId={(r) => r.id}
                columns={columns}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: {paginationModel: {pageSize: 10}},
                }}
                disableRowSelectionOnClick
                // Для обычного пользователя скрываем пагинацию, если данных мало
                hideFooter={!isAdmin && rows.length <= 1}
            />
        </Box>
    );
};