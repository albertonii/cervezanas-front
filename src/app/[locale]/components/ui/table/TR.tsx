import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
    key?: string | number;
    onClick?: () => void;
}

const TR = ({ class_, key, children, onClick }: Props) => {
    return (
        <tr className={` ${class_}`} key={key} onClick={onClick}>
            {children}
        </tr>
    );
};

export default TR;
