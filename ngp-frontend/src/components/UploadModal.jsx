import React, {useState} from "react";
import { X } from "lucide-react";
import { api } from "../js_utilities/APIManager";

export default function UploadModal ({ isOpen, onClose, onUploadComplete }) {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            setFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        const uploadPromises = files.map(file => api.uploadPhoto(file));
        const newPhotos = await Promise.all(uploadPromises);
        onUploadComplete(newPhotos);
        setIsUploading(false);
        setFiles([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all duration-300 ease-out" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Photos</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                    <div
                        className="mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="flex flex-col items-center space-y-2 cursor-pointer">
                            <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p className="text-gray-500 dark:text-gray-400">Drag & drop files here, or <span className="text-indigo-600 dark:text-indigo-400 font-semibold">click to browse</span></p>
                        </label>
                    </div>
                    {files.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Selected Files:</h3>
                            <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                {files.map((file, index) => (
                                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded-md flex justify-between items-center">
                                        <span>{file.name}</span>
                                        <span className="text-xs text-gray-500">{ (file.size / 1024 / 1024).toFixed(2) } MB</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed flex items-center"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        ) : `Upload ${files.length} File(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};
