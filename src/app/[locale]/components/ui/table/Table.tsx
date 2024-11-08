import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
}

const Table = ({ children, class_ }: Props) => {
    return <table className={`w-full ${class_}`}>{children}</table>;
};

export default Table;
