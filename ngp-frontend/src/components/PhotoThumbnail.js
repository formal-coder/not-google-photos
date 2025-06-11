import React from "react";
import { CheckCircle } from "lucide-react";

export default function PhotoThumbnail ({ photo, isSelected, onSelect, onView })
{
    return (
        <div className="relative group cursor-pointer" onClick={() => onView(photo)}>
            <img
                src={photo.thumbnail_url}
                alt={photo.name}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(photo.id);
                }}
                className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 ${
                    isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-white/50 bg-black/20 group-hover:border-white'
                } flex items-center justify-center transition-all`}
            >
                {isSelected && <CheckCircle className="w-4 h-4 text-white"/>}
            </div>
            <div
                className="absolute bottom-0 left-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold text-sm truncate">{photo.name}</p>
            </div>
        </div>
    );
};
