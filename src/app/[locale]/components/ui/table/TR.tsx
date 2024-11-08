import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
    key?: string | number;
}

const TR = ({ class_, key, children }: Props) => {
    return (
        <tr className={` ${class_}`} key={key}>
            {children}
        </tr>
    );
};

export default TR;
