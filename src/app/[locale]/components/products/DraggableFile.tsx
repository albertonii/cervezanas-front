import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useTranslations } from 'next-intl';
import { Move, Star, Video, X, ZoomIn } from 'lucide-react';
import { UploadedFile } from '@/lib/types/types';

interface DraggableFileProps {
    index: number;
    file: UploadedFile;
    removeFile: (index: number) => void;
    moveFile: (dragIndex: number, hoverIndex: number) => void;
    openPreview: (fileSrc: string) => void;
    setMainImage: (index: number) => void;
}

const DraggableFile: React.FC<DraggableFileProps> = ({
    index,
    file,
    removeFile,
    moveFile,
    openPreview,
    setMainImage,
}) => {
    const t = useTranslations();

    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'FILE',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'FILE',
        hover(item: { index: number }, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveFile(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const fileUrl = URL.createObjectURL(file.file);

    return (
        <div ref={ref} className={`relative ${isDragging ? 'opacity-50' : ''}`}>
            {file.type === 'image' ? (
                <Image
                    src={fileUrl ?? ''}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-move"
                    width={192}
                    height={108}
                />
            ) : (
                <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-lg cursor-move">
                    <Video className="text-gray-500" size={32} />
                </div>
            )}

            <button
                onClick={() => removeFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                aria-label="Eliminar archivo"
            >
                <X size={16} />
            </button>

            <button
                onClick={() => openPreview(fileUrl ?? '')}
                className="absolute bottom-0 right-0 bg-beer-gold text-white rounded-full p-1 m-1"
                aria-label="Previsualizar archivo"
            >
                <ZoomIn size={16} />
            </button>

            {file.type === 'image' && (
                <button
                    onClick={() => setMainImage(index)}
                    className={`absolute top-0 left-0 ${
                        file.isMain ? 'text-beer-blonde' : 'text-gray-400'
                    } bg-white rounded-full p-1 m-1`}
                    aria-label={
                        file.isMain
                            ? 'Imagen principal'
                            : 'Establecer como imagen principal'
                    }
                >
                    <Star size={16} />
                </button>
            )}

            <div className="absolute bottom-0 left-0 bg-gray-800 text-white text-xs px-1 rounded-tr-lg">
                <Move size={12} className="inline mr-1" />
                {t('media_uploader.move')}
            </div>
        </div>
    );
};

export default DraggableFile;
