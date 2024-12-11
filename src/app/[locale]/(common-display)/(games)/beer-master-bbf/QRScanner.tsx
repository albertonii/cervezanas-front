import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import BasicModal from '@/app/[locale]/components/modals/BasicModal';
import React, { useState } from 'react';
import { Scan } from 'lucide-react';

interface Props {
    onScan: (data: string) => void;
}

export default function QRScanner({ onScan }: Props) {
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = (text: string) => {
        if (text) {
            onScan(text);
            setIsScanning(false); // Detiene el escáner después de un escaneo exitoso
        }
    };

    const handleError = (error: any) => {
        console.error('QR Error:', error);
    };

    const handleOpenScanner = () => {
        setIsScanning(true); // Activa el escáner
    };

    const closeScanner = () => {
        setIsScanning(false);
    };

    return (
        <div>
            {isScanning ? (
                <BasicModal
                    showModal={isScanning}
                    title={''}
                    description={''}
                    setShowModal={closeScanner} // Cambia a closeScanner para desmontar el QrReader
                >
                    <>
                        <BarcodeScannerComponent
                            width={500}
                            height={500}
                            onUpdate={(err, result: any) => {
                                if (result) {
                                    handleScan(result.text);
                                }
                            }}
                            onError={handleError}
                        />
                    </>
                </BasicModal>
            ) : (
                <button
                    onClick={handleOpenScanner}
                    className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-beer-foam rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 hover:shadow-2xl"
                >
                    <Scan className="w-8 h-8 sm:w-12 sm:h-12 text-beer-gold" />
                </button>
            )}
        </div>
    );
}
