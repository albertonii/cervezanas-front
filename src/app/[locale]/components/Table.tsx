import React from 'react';

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className="px-6 py-3 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-medium"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                            {columns.map((column) => (
                                <td
                                    key={column.accessor}
                                    className="px-6 py-4 text-gray-800 text-sm"
                                >
                                    {column.render
                                        ? column.render(
                                              row[column.accessor],
                                              row,
                                          )
                                        : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
