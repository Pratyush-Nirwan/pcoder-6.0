import React from "react";
const MacImageWindow = ({ src, title = "Image", width = "600px" }) => {
    return (
        <div className="flex items-center justify-center p-6 -translate-x-50">
            <div
                className="border rounded-2xl border-white/50 overflow-hidden "
                style={{ width }}
            >
                <div className="flex items-center gap-2 px-4 py-2 fixed ">
                    <div className="flex gap-2">
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                        <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                        <span className="w-3 h-3 bg-transparent border rounded-full"></span>
                    </div>
                    <span className="text-zinc-400 text-sm ml-3">{title}</span>
                </div>
                <img src={src} className="w-full object-contain" />
            </div>
        </div>
    );
};

export default MacImageWindow;