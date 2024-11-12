import React from 'react';
import { Scan } from 'lucide-react';

interface QRScannerProps {
    onScan: () => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
    return (
        <div className="fixed bottom-6 right-6">
            <button
                onClick={onScan}
                className="flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-300"
            >
                <Scan className="w-8 h-8 text-beer-gold" />
            </button>
        </div>
    );
}
