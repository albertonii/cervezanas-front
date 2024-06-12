import React from 'react';

interface Props {
    name: string;
    index: number;
    setSelectedNames: React.Dispatch<React.SetStateAction<string[]>>;
    selectedNames: string[];
}

export default function ChipCard({
    name,
    index,
    setSelectedNames,
    selectedNames,
}: Props) {
    return (
        <span
            key={name + index}
            className="flex rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600 hover:bg-gray-200"
        >
            {name.toLowerCase()}

            <figure
                className="ml-2 hover:cursor-pointer "
                onClick={() => {
                    setSelectedNames(
                        selectedNames.filter(
                            (selectedName) => selectedName !== name,
                        ),
                    );
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="hover:text-bold h-4 w-4 text-gray-600 transition-all hover:scale-150 hover:text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.707 10l4.147-4.146a.5.5 0 10-.708-.708L10 9.293 5.854 5.146a.5.5 0 10-.708.708L9.293 10l-4.147 4.146a.5.5 0 00.708.708L10 10.707l4.146 4.147a.5.5 0 00.708-.708L10.707 10z"
                        clipRule="evenodd"
                    />
                </svg>
            </figure>
        </span>
    );
}
