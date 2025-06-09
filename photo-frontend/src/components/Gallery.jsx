import React, { useState, useEffect, useMemo } from 'react';
import PhotoThumbnail from './PhotoThumbnail';
import PhotoViewer from './PhotoViewer';
import UploadModal from './UploadModal';
import ConfirmationModal from './ConfirmationModal';
import Tooltip from './Tooltip';
import { api } from '../js_utilities/APIManager';
import { Plus, Trash2, Sun, Moon, Search } from 'lucide-react';

// --- App Component ---

export default function Gallery() {
    const [theme, setTheme] = useState('light');
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [viewerPhoto, setViewerPhoto] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false, onConfirm: () => {
        }, title: '', message: ''
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        console.log('Theme changed to:', theme);
    }, [theme]);

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true);
            const fetchedPhotos = await api.listPhotos();
            setPhotos(fetchedPhotos);
            setIsLoading(false);
        };
        fetchPhotos();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleUploadComplete = (newPhotos) => {
        setPhotos(prevPhotos => [...newPhotos, ...prevPhotos]);
    };

    const handleSelectPhoto = (photoId) => {
        setSelectedPhotos(prev =>
            prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
        );
    };

    const clearSelection = () => setSelectedPhotos([]);

    const handleDeleteSelected = () => {
        if (selectedPhotos.length === 0) return;
        setModalState({
            isOpen: true,
            title: 'Delete Photos',
            message: `Are you sure you want to delete ${selectedPhotos.length} photo(s)? This action cannot be undone.`,
            onConfirm: async () => {
                await api.deletePhotos(selectedPhotos);
                setPhotos(photos.filter(p => !selectedPhotos.includes(p.id)));
                setSelectedPhotos([]);
                setModalState({...modalState, isOpen: false});
            },
        });
    };

    const filteredPhotos = useMemo(() =>
        photos.filter(photo =>
            photo.name.toLowerCase().includes(searchQuery.toLowerCase())
        ), [photos, searchQuery]);

    const handleViewPhoto = (photo) => {
        setViewerPhoto(photo);
    };

    const handleCloseViewer = () => {
        setViewerPhoto(null);
    };

    const handleNavigateViewer = (direction) => {
        const currentIndex = filteredPhotos.findIndex(p => p.id === viewerPhoto.id);
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % filteredPhotos.length;
        } else {
            nextIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        }
        setViewerPhoto(filteredPhotos[nextIndex]);
    };

    const SearchBar = () => (
        <div className="flex-1 max-w-xs ml-8 hidden md:block">
            <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400"/>
                  </span>
                <input
                    type="search"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
    );

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

    const SelectionActionBar = () => {
        return (
            /* Action Bar for Selected Photos */
            <div className={`fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ${selectedPhotos.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="container mx-auto p-4">
                    <div
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-2xl p-4 flex justify-between items-center">
                        <p className="font-semibold">{selectedPhotos.length} photo(s) selected</p>
                        <div className="flex items-center space-x-3">
                            <button onClick={handleDeleteSelected}
                                    className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors">
                                <Trash2 size={18}/>
                                <span>Delete</span>
                            </button>
                            <button onClick={clearSelection}
                                    className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
            <header
                className="sticky top-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24"
                                 fill="currentColor">
                                <path
                                    d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
                            </svg>
                            <h1 className="text-xl font-bold">PhotoManager</h1>
                        </div>
                        <SearchBar/>
                        <div className="flex items-center space-x-3">
                            <UploadButton />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {isLoading ? (
                    <div className="text-center py-20">
                        <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg font-semibold">Loading your moments...</p>
                    </div>
                ) : filteredPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredPhotos.map(photo => (
                            <PhotoThumbnail
                                key={photo.id}
                                photo={photo}
                                isSelected={selectedPhotos.includes(photo.id)}
                                onSelect={handleSelectPhoto}
                                onView={handleViewPhoto}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold mb-2">No photos found</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : "Your gallery is empty. Upload your first photo!"}
                        </p>
                    </div>
                )}
            </main>

            <SelectionActionBar />

            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)}
                         onUploadComplete={handleUploadComplete}/>
            <PhotoViewer photo={viewerPhoto} onClose={handleCloseViewer} onNavigate={handleNavigateViewer}/>
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({...modalState, isOpen: false})}
                onConfirm={modalState.onConfirm}
                title={modalState.title}
                message={modalState.message}
            />
        </div>
    );
}
