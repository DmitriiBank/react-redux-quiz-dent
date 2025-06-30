import { AnswerItem } from "./AnswerItem.tsx";

type Props = {
    options: string[];
    onClick: (idx: number) => void;
    selected: number | null; // может быть null
};

export const AnswersList = ({ options, onClick, selected }: Props) => {
    return (
        <div className="options">
            {options.map((option, idx) => {
                const isSelected = selected === idx;
                const className = isSelected ? 'option selected' : 'option';

                return (
                    <AnswerItem
                        key={idx}
                        className={className}
                        answer={option}
                        onClick={() => onClick(idx)}
                    />
                );
            })}
        </div>
    );
};
