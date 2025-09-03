// pages/LecturesPage.tsx
import * as React from 'react';
import {Container, Typography} from '@mui/material';
import LectureCard from './LectureCard';
import LectureViewerDialog from './LectureViewerDialog';
import type {LectureTypes} from '../../utils/lecture-types.ts';
import {LECTURES} from '../../utils/lecture-types.ts';

const LecturesPage = () => {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState<LectureTypes | null>(null);

    const handleOpen = (lec: LectureTypes) => {
        setActive(lec);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <div className="quiz-selection-container">
            <Container
                maxWidth="lg"
                sx={{py: 4}}
            >
                <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{mb: 3, textAlign: 'center'}}
                >
                    Выберите лекцию
                </Typography>

                <div className="quiz-categories">
                    {LECTURES.map((lec) => (
                        <LectureCard
                            key={lec.id}
                            lecture={lec}
                            onOpen={handleOpen}
                        />
                    ))}
                </div>

                {active && (
                    <LectureViewerDialog
                        open={open}
                        onClose={handleClose}
                        title={active.title}
                        src={active.pdfUrl}
                    />
                )}
            </Container>
        </div>
    );
}

export default LecturesPage;