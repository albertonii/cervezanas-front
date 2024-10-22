import imageCompression from 'browser-image-compression';
import DraggableFile from './DraggableFile';
import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { useTranslations } from 'next-intl';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useFileUpload } from '@/app/context/ProductFileUploadContext';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadedFile {
    file: File;
    type: 'image' | 'video';
    isMain?: boolean;
}

const ProductMediaUploader: React.FC = () => {
    const t = useTranslations();

    const { files, setFiles } = useFileUpload();

    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    // useEffect(() => {
    //     const existingFiles = getValues('multimedia_files') || [];

    //     console.log('existingFiles', existingFiles);

    //     const initialFiles = existingFiles.map((file: File) => ({
    //         file,
    //         type: file.type.startsWith('image/') ? 'image' : 'video',
    //         isMain: false,
    //     }));

    //     if (initialFiles.length > 0 && initialFiles[0].type === 'image') {
    //         initialFiles[0].isMain = true;
    //     }

    //     setFiles(initialFiles);
    // }, [getValues]);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setLoading(true);
            setErrors([]);

            const newFiles = [...files];
            const newErrors: string[] = [];

            for (let index = 0; index < acceptedFiles.length; index++) {
                const file = acceptedFiles[index];

                if (file.type.startsWith('image/')) {
                    if (
                        newFiles.filter((f) => f.type === 'image').length >=
                        MAX_IMAGES
                    ) {
                        newErrors.push(
                            'Se ha alcanzado el límite máximo de imágenes.',
                        );
                        continue;
                    }
                    if (file.size > MAX_FILE_SIZE) {
                        newErrors.push(
                            `${file.name} excede el tamaño máximo de 5MB.`,
                        );
                        continue;
                    }
                    try {
                        const compressedFile = await imageCompression(file, {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                        });

                        // Si es la primera imagen agregada, se establece como la imagen principal
                        newFiles.push({
                            file: compressedFile,
                            type: 'image',
                            isMain: newFiles.length === 0, // La primera imagen será la principal
                        });
                    } catch (error) {
                        newErrors.push(`Error al comprimir ${file.name}.`);
                    }
                } else if (file.type.startsWith('video/')) {
                    if (newFiles.some((f) => f.type === 'video')) {
                        newErrors.push('Solo se permite subir un video.');
                        continue;
                    }
                    if (file.size > MAX_VIDEO_SIZE) {
                        newErrors.push(
                            `${file.name} excede el tamaño máximo de 50MB.`,
                        );
                        continue;
                    }
                    newFiles.push({ file, type: 'video' });
                } else {
                    newErrors.push(
                        `${file.name} no es un archivo de imagen o video válido.`,
                    );
                }
            }

            setFiles(newFiles);
            setErrors(newErrors);
            setLoading(false);
        },
        [files],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': [],
        },
        maxFiles: MAX_IMAGES + 1 - files.length,
    });

    const removeFile = (index: number) => {
        setFiles((prevFiles) => {
            const newFiles = prevFiles.filter((_, i) => i !== index);
            if (
                prevFiles[index].isMain &&
                newFiles.length > 0 &&
                newFiles[0].type === 'image'
            ) {
                newFiles[0].isMain = true;
            }
            return newFiles;
        });
    };

    const moveFile = (dragIndex: number, hoverIndex: number) => {
        const newFiles = [...files];
        const draggedFile = newFiles[dragIndex];
        newFiles.splice(dragIndex, 1);
        newFiles.splice(hoverIndex, 0, draggedFile);
        setFiles(newFiles);
    };

    const setMainImage = (index: number) => {
        setFiles((prevFiles) =>
            prevFiles.map((file, i) => ({
                ...file,
                isMain: i === index && file.type === 'image',
            })),
        );
    };

    const openPreview = (fileSrc: string) => {
        setPreviewFile(fileSrc);
    };

    const closePreview = () => {
        setPreviewFile(null);
    };

    return (
        <div className="w-full">
            <DndProvider backend={HTML5Backend}>
                <div className="max-w-md mx-auto ">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive
                                ? ''
                                : 'border-gray-300 hover:border-beer-blonde'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                            {isDragActive
                                ? 'Suelta los archivos aquí'
                                : 'Arrastra y suelta tus imágenes y video aquí o haz clic para seleccionar'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            {t('media_uploader.limitations')}
                        </p>
                    </div>

                    {loading && (
                        <div className="mt-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-beer-blonde"></div>
                            <p className="mt-2 text-sm text-gray-600">
                                {t('media_uploader.loading_files')}
                            </p>
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <ul className="list-disc list-inside">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                        <span>
                            {files.filter((f) => f.type === 'image').length} de{' '}
                            {MAX_IMAGES} {t('media_uploader.images')}{' '}
                            {files.some((f) => f.type === 'video') &&
                                ' + 1 video'}
                        </span>
                        {files.filter((f) => f.type === 'image').length >=
                            MAX_IMAGES && (
                            <span className="flex items-center text-amber-500">
                                <AlertCircle size={16} className="mr-1" />
                                {t('media_uploader.max_images_reached')}
                            </span>
                        )}
                    </div>

                    {files.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <DraggableFile
                                    key={index}
                                    index={index}
                                    file={file}
                                    removeFile={removeFile}
                                    moveFile={moveFile}
                                    openPreview={openPreview}
                                    setMainImage={setMainImage}
                                />
                            ))}
                        </div>
                    )}

                    {previewFile && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            onClick={closePreview}
                        >
                            {previewFile.startsWith('data:video') ? (
                                <video
                                    src={previewFile}
                                    controls
                                    className="max-w-full max-h-full"
                                />
                            ) : (
                                <img
                                    src={previewFile}
                                    alt="Preview"
                                    className="max-w-full max-h-full"
                                />
                            )}
                        </div>
                    )}
                </div>
            </DndProvider>
        </div>
    );
};

export default ProductMediaUploader;
