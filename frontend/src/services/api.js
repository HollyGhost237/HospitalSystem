import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- INTERCEPTEUR DE REQUÊTE ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTEUR DE RÉPONSE ---
api.interceptors.response.use(
  (response) => {
    // 1. GESTION DE LA PAGINATION (AJOUTÉ)
    // On extrait 'results' pour que le frontend reçoive directement le tableau
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return {
        ...response,
        data: response.data.results, // On remplace par le tableau propre
        fullData: response.data      // On garde l'original au cas où (pour le count total)
      };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 2. GESTION DU REFRESH TOKEN (TON CODE EXISTANT)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken
        });

        const newToken = res.data.access;
        localStorage.setItem("access_token", newToken);
        
        // On met à jour l'instance globale et la requête en cours
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;