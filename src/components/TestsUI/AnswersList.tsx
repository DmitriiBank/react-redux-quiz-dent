import { AnswerItem } from "./AnswerItem.tsx";

type Props = {
    options: { ru: string[]; he: string[] };
    onClick: (idx: number) => void;
    selected: number | null;
    lang: 'ru' | 'he'
};

export const AnswersList = ({ options, onClick, selected, lang }: Props) => {
    if (!options || !options[lang]) {
        return <div>Нет данных для вариантов ответа.</div>;
    }
    return (
        <div className="options">
            {options[lang].map((_, idx) => {
                const isSelected = selected === idx;
                const className = isSelected ? 'option selected' : 'option';

                return (
                    <AnswerItem
                        key={idx}
                        className={className}
                        answer={{
                            ru: options.ru[idx],
                            he: options.he[idx],
                        }}
                        onClick={() => onClick(idx)}
                        lang={lang}
                    />
                );
            })}
        </div>
    );
};
