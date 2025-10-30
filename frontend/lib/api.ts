// API utility fonksiyonları
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API çağrısı için genel fonksiyon
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Token varsa Authorization header'ına ekle
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.msg || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// Auth API fonksiyonları
export const authAPI = {
  // Kullanıcı kaydı
  register: async (userData: { username: string; email: string; password: string }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Kullanıcı girişi
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Token'ı localStorage'a kaydet
  saveToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Token'ı localStorage'dan al
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Token'ı localStorage'dan sil
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Kullanıcının giriş yapıp yapmadığını kontrol et
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Notes API fonksiyonları (ileride kullanılacak)
export const notesAPI = {
  // Tüm notları getir
  getAllNotes: async () => {
    return apiCall('/notes');
  },

  // Tek not getir
  getNote: async (id: string) => {
    return apiCall(`/notes/${id}`);
  },

  // Not oluştur
  createNote: async (noteData: { title: string; content: string }) => {
    return apiCall('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  // Not güncelle
  updateNote: async (id: string, noteData: { title: string; content: string }) => {
    return apiCall(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  },

  // Not sil
  deleteNote: async (id: string) => {
    return apiCall(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default { authAPI, notesAPI };
