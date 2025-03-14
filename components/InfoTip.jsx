import React, { useState } from "react";

export default function InfoTip({ Component, message }) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {Component}
            {isVisible && (
                <div className="absolute z-10 bg-gray-800 text-white text-sm rounded-md p-2 left-1/2 -translate-x-1/2 bottom-full mb-2 shadow-lg">
                    {message}
                </div>
            )}
        </div>
    );
}
