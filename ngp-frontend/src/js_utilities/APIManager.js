import axios from "axios";
import {API} from './AppConfig';

const localEndpoint = 'http://localhost:3000';

// --- Mock Data & API Simulation ---
// In a real application, you would fetch this data from your backend.
const initialPhotos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2070&auto=format&fit=crop', name: 'Misty Mountains', date: '2024-05-15', size: '4.1MB' },
    { id: 2, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', name: 'Golden Valley', date: '2024-05-14', size: '5.8MB' },
    { id: 3, url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop', name: 'Forest Path', date: '2024-05-13', size: '3.5MB' },
    { id: 4, url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop', name: 'Lakeside Cabin', date: '2024-05-12', size: '6.2MB' },
    { id: 5, url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop', name: 'Sunlight Through Trees', date: '2024-05-11', size: '4.9MB' },
    { id: 6, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop', name: 'Mountain Peak', date: '2024-05-10', size: '7.1MB' },
    { id: 7, url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2400&auto=format&fit=crop', name: 'Green Fields', date: '2024-05-09', size: '5.5MB' },
    { id: 8, url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1974&auto=format&fit=crop', name: 'Waterfall Wonder', date: '2024-05-08', size: '8.0MB' },
];

// This simulates API calls to your backend endpoints
const api = {
    listPhotos: async () => {
        try {
            const response = await axios.get(localEndpoint + API.LIST_PHOTOS);
            if (response.data.status === 'success') {
                const photos = response.data.photos.map((photo) => ({
                    ...photo,
                    url: localEndpoint + API.VIEW_PHOTO + photo.filename,
                    thumbnail_url: localEndpoint + API.VIEW_THUMBNAIL + photo.filename,
                }));
                console.log('API: Photo list fetched successfully.', photos);
                return photos;
            }
        } catch (e) {
            console.error("API: Failed to fetch photo list.", e);
        }
        return initialPhotos;
    },
    uploadPhotos: async (files) => {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('photos', file);
            });
            console.log(`API: Uploading ${files.length} photos...`);
            const response = await axios.post(localEndpoint + API.UPLOAD_PHOTOS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                const photos = response.data.photos.map((photo) => ({
                    ...photo,
                    url: localEndpoint + API.VIEW_PHOTO + photo.filename,
                    thumbnail_url: localEndpoint + API.VIEW_THUMBNAIL + photo.filename,
                }));
                console.log("API: Upload complete.", photos);
                return photos;
            }
        } catch (e) {
            console.error("API: Upload failed.", e);
        }
        return false;
    },
    deletePhotos: async (photoIds) => {
        try {
            console.log(`API: Deleting photos with IDs: ${photoIds.join(', ')}...`);
            const response = await axios.delete(localEndpoint + API.DELETE_PHOTOS, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    photoIds: photoIds,
                },
            });
            if (response.data.success) {
                console.log("API: Deletion complete.");
                return true;
            }
        } catch (e) {
            console.error("API: Deletion failed.", e);
        }
        return false;
    },
};

export { api };
