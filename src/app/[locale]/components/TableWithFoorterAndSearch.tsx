import React, { useState, useMemo } from 'react';
import InputSearch from './common/InputSearch';
import PaginationFooter from './common/PaginationFooter';

interface Column {
    header: string;
    accessor: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
    columns: Column[];
    data: any[];
    initialQuery?: string;
    resultsPerPage?: number;
    searchPlaceHolder: string;
    paginationCounter: number;
}

const TableWithFoorterAndSearch: React.FC<TableProps> = ({
    columns,
    data,
    initialQuery = '',
    resultsPerPage = 10,
    searchPlaceHolder,
    paginationCounter = 0,
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        if (!query) return data;
        return data.filter((row) =>
            columns.some((column) =>
                String(row[column.accessor])
                    .toLowerCase()
                    .includes(query.toLowerCase()),
            ),
        );
    }, [query, data, columns]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * resultsPerPage;
        return filteredItems.slice(startIndex, startIndex + resultsPerPage);
    }, [filteredItems, currentPage, resultsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / resultsPerPage);

    return (
        <div className="space-y-4">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={searchPlaceHolder}
            />

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
                        {paginatedItems.map((row, rowIndex) => (
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

            <PaginationFooter
                counter={paginationCounter}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default TableWithFoorterAndSearch;
