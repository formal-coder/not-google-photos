import React from "react";

export default function Tooltip({ text, children }) {
    return (
        <div className="relative group flex items-center">
            {children}
            <div className="absolute bottom-full w-max hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                {text}
            </div>
        </div>
    )
};
