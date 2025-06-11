import React, {useEffect, useState} from "react";
import Tooltip from "./Tooltip";
import { Info, Download, X } from "lucide-react";

export default function PhotoViewer ({ photo, onClose, onNavigate }) {
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNavigate('next');
            if (e.key === 'ArrowLeft') onNavigate('prev');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNavigate]);

    if (!photo) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-lg z-50 flex flex-col items-center justify-center" onClick={onClose}>
            <div className="absolute top-0 right-0 p-4 flex space-x-4 z-10">
                <Tooltip text={showInfo ? "Hide Info" : "Show Info"}>
                    <button onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }} className="text-white/80 hover:text-white transition-colors"><Info size={24} /></button>
                </Tooltip>
                <Tooltip text="Download">
                    <a href={photo.url} download={photo.description} onClick={(e) => e.stopPropagation()} className="text-white/80 hover:text-white transition-colors"><Download size={24} /></a>
                </Tooltip>
                <Tooltip text="Close (Esc)">
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors"><X size={30} /></button>
                </Tooltip>
            </div>

            <button onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all">
                &lt;
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNavigate('next'); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all">
                &gt;
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-8" onClick={e => e.stopPropagation()}>
                <img src={photo.url} alt={photo.description} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                {showInfo && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white p-4 rounded-lg text-sm w-auto max-w-sm">
                        <p><strong>Name:</strong> {photo.description}</p>
                        <p><strong>Date:</strong> {photo.date}</p>
                        <p><strong>Size:</strong> {photo.size}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
