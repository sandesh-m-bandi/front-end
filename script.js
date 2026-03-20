// Backend base URL (override by setting window.API_BASE before loading this script)
const API_BASE = window.API_BASE || 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

// For uploading images (multipart)
async function uploadImages(url, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const res = await fetch(url, { method: 'POST', body: formData });
    return await res.json();
}