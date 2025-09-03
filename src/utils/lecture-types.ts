
export type LectureStatus = 'done' | 'available' | 'locked';

export type LectureTypes = {
    id: string;                 // slug, например "lecture-1"
    title: string;              // "Лекция 1"
    subtitle: string;           // "Введение в стоматологию"
    iconUrl: string;            // /assets/icons/...
    status: LectureStatus;      // done/available/locked
    pdfUrl: string;             // /static/lectures/<id>.pdf
};

export type Tooth = {
    id: string;                 // slug, например "lecture-1"
    title: string;
    icon: string;
    videoUrl?: string,
    imagesUrl?: string[];
};


export const LECTURES: LectureTypes[] = [
    {
        id: 'lecture-1',
        title: 'Лекция 1',
        subtitle: 'Введение в стоматологию',
        iconUrl: './image/icon_1.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-1.pdf',
    },
    {
        id: 'lecture-2',
        title: 'Лекция 2',
        subtitle: 'Анатомия',
        iconUrl: './image/icon_2.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-2.pdf',
    },
    {
        id: 'lecture-3',
        title: 'Лекция 3',
        subtitle: 'Кариес, его осложнения. Виды ортопедических конструкций',
        iconUrl: './image/icon_3.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-3.pdf',
    },
    {
        id: 'lecture-4',
        title: 'Лекция 4',
        subtitle: 'Клинико-лабораторные этапы несъемного протезирования',
        iconUrl: './image/icon_4.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-4.pdf',
    },
    {
        id: 'lecture-5',
        title: 'Лекция 5',
        subtitle: 'Окклюзия, прикус, артикуляция',
        iconUrl: './image/icon_5.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-5.pdf',
    },
    {
        id: 'lecture-6',
        title: 'Лекция 6',
        subtitle: 'Клинико-лабораторные этапы съемного протезирования',
        iconUrl: './image/icon_6.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-6.pdf',
    },
    {
        id: 'lecture-7',
        title: 'Лекция 7',
        subtitle: 'Импланты',
        iconUrl: './image/icon_7.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-7.pdf',
    },
    {
        id: 'lecture-8',
        title: 'Лекция 8',
        subtitle: 'Введение в Cad/Cam',
        iconUrl: './image/icon_8.svg',
        status: 'done',
        pdfUrl: './lectures/lecture-8.pdf',
    }
];


export const TEETH: Tooth[] = [
    {
        id: 'tooth-1.1-2',
        title: 'Резцы верхней челюсти',
        icon: './image/tooth/icon_tooth_1.png',
        videoUrl: 'https://www.youtube.com/watch?v=sNdkrBf7NPw',
        imagesUrl: ['./image/tooth/tooth-1.1-B.png',
            './image/tooth/tooth-1.1-M.png',
            './image/tooth/tooth-1.1-P.png',
            './image/tooth/tooth-1.1-D.png',
            './image/tooth/tooth-1.1-I.png',
            ],
    },
    {
        id: 'tooth-3.1-2',
        title: 'Резцы нижней челюсти',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },
    {
        id: 'tooth-3',
        title: 'Клыки',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },
    {
        id: 'tooth-1.4-5',
        title: 'Премоляры верхней челюсти',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },
    {
        id: 'tooth-3.4-5',
        title: 'Премоляры нижней челюсти',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },
    {
        id: 'tooth-1.6-8',
        title: 'Моляры верхней челюсти',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },
    {
        id: 'tooth-3.6-8',
        title: 'Моляры нижней челюсти',
        icon: './image/soon.png',
        videoUrl: '',
        imagesUrl: [],
    },

];