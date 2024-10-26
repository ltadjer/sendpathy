import axios from 'axios';

// Create an Axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to request headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized responses
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, { refreshToken });
                localStorage.setItem('access_token', data.access_token);
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return apiClient(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default {
    /**
     * Fetch all conversations for the logged-in user.
     */
    async fetchConversations() {
        const response = await apiClient.get('/conversations');
        console.log(response.data);
        return response.data;
    },

    /**
     * Fetch messages for a specific conversation.
     * @param conversationId - The ID of the conversation.
     */
    async fetchMessages(conversationId: string) {
        const response = await apiClient.get(`/conversations/${conversationId}/messages`);
        return response.data;
    },

    /**
     * Send a new message in a specific conversation.
     * @param conversationId - The ID of the conversation.
     * @param messageContent - The content of the message.
     */
    async sendMessage(conversationId: string, messageContent: string) {
        const response = await apiClient.post(`/conversations/${conversationId}/messages`, { content: messageContent });
        return response.data;
    },
};