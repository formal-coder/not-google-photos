import React, {useState, useEffect } from 'react';
import PhotoThumbnail from './PhotoThumbnail';
import PhotoViewer from './PhotoViewer';
import UploadModal from './UploadModal';
import ConfirmationModal from './ConfirmationModal';
import { api } from '../js_utilities/APIManager';
import {Trash2} from 'lucide-react';

// --- App Component ---

export default function Gallery({ isUploadOpen, setIsUploadOpen }) {
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [viewerPhoto, setViewerPhoto] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false, onConfirm: () => {
        }, title: '', message: ''
    });

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true);
            const fetchedPhotos = await api.listPhotos();
            setPhotos(fetchedPhotos);
            setIsLoading(false);
        };
        fetchPhotos();
    }, []);

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
                clearSelection();
                setModalState({...modalState, isOpen: false});
            },
        });
    };

    const handleViewPhoto = (photo) => {
        setViewerPhoto(photo);
    };

    const handleCloseViewer = () => {
        setViewerPhoto(null);
    };

    const handleNavigateViewer = (direction) => {
        if (!viewerPhoto) return;
        const currentIndex = photos.findIndex(p => p.id === viewerPhoto.id);
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % photos.length;
        } else {
            nextIndex = (currentIndex - 1 + photos.length) % photos.length;
        }
        setViewerPhoto(photos[nextIndex]);
    };

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
        <>
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
                ) : photos?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {photos.map(photo => (
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
                            {"Your gallery is empty. Upload your first photo!"}
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
        </>
    );
}
