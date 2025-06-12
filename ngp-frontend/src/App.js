import React, { useEffect, useState } from 'react';
import Gallery from './components/Gallery';
import { api } from './js_utilities/APIManager';
import {Camera, Moon, Plus, Sun} from "lucide-react";
import Tooltip from "./components/Tooltip";

export default function App() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useState(prefersDark ? 'dark' : 'light');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isServerConnected, setIsServerConnected] = useState(null);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        const checkServerConnection = async () => {
            const connected = await api.preflightCheck();
            setIsServerConnected(connected);
        };
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        checkServerConnection();
    }, []);


    const ThemeToggle = () => (
        <Tooltip text={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
            <button onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
            </button>
        </Tooltip>
    );

    const UploadButton = () => (
        <Tooltip text="Upload Photo">
            <button onClick={() => setIsUploadOpen(true)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
                <Plus size={20}/>
                <span className="hidden sm:inline">Upload</span>
            </button>
        </Tooltip>
    )

    return (
        <div
            className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
            <header
                className="sticky top-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Camera/>
                            <h1 className="text-xl font-bold">not google photos</h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* upload only work when backend is running */}
                            {isServerConnected && <UploadButton/>}
                            <ThemeToggle/>
                        </div>
                    </div>
                </div>
            </header>

            {isServerConnected
                ? <Gallery isUploadOpen={isUploadOpen} setIsUploadOpen={setIsUploadOpen} />
                : (
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">not google photos</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Failed to connect to the server. Please try again later.
                        </p>
                    </div>
                )
            }
        </div>
    )
}
