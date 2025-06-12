import axios from "axios";
import {API} from './AppConfig';

const localEndpoint = 'http://localhost:3000';

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
        return false;
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
    preflightCheck: async () => {
        try {
            console.log("API: Performing preflight check...");
            const response = await axios.get(localEndpoint + API.PRE_FLIGHT_CHECK);
            if (response.data.success) {
                console.log("API: Preflight check successful.");
                return true;
            }
        } catch (e) {
            console.error("API: Preflight check failed.", e);
        }
        return false;
    }
};

export { api };
