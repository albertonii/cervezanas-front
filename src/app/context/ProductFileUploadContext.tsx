import React, { createContext, useState, useContext } from 'react';

interface UploadedFile {
    file: File;
    type: 'image' | 'video';
    isMain?: boolean;
}

interface FileUploadContextType {
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    clearFiles: () => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(
    undefined,
);

interface ProductFileUploadProviderProps {
    children: React.ReactNode;
}

export const ProductFileUploadProvider: React.FC<
    ProductFileUploadProviderProps
> = ({ children }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);

    const clearFiles = () => {
        setFiles([]);
    };

    return (
        <FileUploadContext.Provider value={{ files, setFiles, clearFiles }}>
            {children}
        </FileUploadContext.Provider>
    );
};

export const useFileUpload = () => {
    const context = useContext(FileUploadContext);
    if (!context) {
        throw new Error(
            'useFileUpload must be used within a FileUploadProvider',
        );
    }
    return context;
};
