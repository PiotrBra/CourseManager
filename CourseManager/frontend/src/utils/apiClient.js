import axios from "axios";

// Tworzenie instancji Axios z domyślnymi nagłówkami
const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

// Dodanie interceptorów dołączenia tokena
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Client Error:", error);
        return Promise.reject(error);
    }
);

export default apiClient;
