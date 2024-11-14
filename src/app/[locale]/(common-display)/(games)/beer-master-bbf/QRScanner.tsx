import React from 'react';
import { Scan } from 'lucide-react';

interface QRScannerProps {
    onScan: () => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
    return (
        <div className="sticky pl-8 bottom-6 right-6">
            <button
                onClick={onScan}
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-amber-500 rounded-full shadow-lg hover:bg-amber-600 transition-all duration-300 hover:shadow-2xl"
            >
                <Scan className="w-8 h-8 sm:w-12 sm:h-12 text-beer-gold" />
            </button>
        </div>
    );
}
