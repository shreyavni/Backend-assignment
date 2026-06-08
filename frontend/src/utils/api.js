
const BASE_URL = 'http://localhost:5000/api/v1';

const api = {
    request: async (endpoint, method = 'GET', body = null) => {
        const token = localStorage.getItem('jwt_token');
        const headers = { 'Content-Type': 'application/json' };

        // Attach JWT token if it exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = { method, headers };
        if (body) config.body = JSON.stringify(body);

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            return { data };
        } catch (error) {
            // Handle network errors (e.g., backend is offline)
            if (error.message === 'Failed to fetch') {
                throw new Error('Cannot connect to server. Is the backend running on port 5000?');
            }
            throw error;
        }
    },
    get: (endpoint) => api.request(endpoint),
    post: (endpoint, body) => api.request(endpoint, 'POST', body),
    put: (endpoint, body) => api.request(endpoint, 'PUT', body),
    delete: (endpoint) => api.request(endpoint, 'DELETE')
};
