import CONFIG from '../config';

const ENDPOINTS = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch (error) {
    throw new Error('Gagal mengurai respons JSON dari server.');
  }
}

function handleErrorResponse(response, context = 'Permintaan') {
  switch (response.status) {
    case 400:
      throw new Error(`${context} gagal: Bad Request (${response.status}).`);
    case 401:
      throw new Error(`${context} gagal: Token tidak valid atau sudah kedaluwarsa.`);
    case 413:
      throw new Error(`${context} gagal: Ukuran file terlalu besar.`);
    default:
      throw new Error(`${context} gagal: ${response.statusText} (${response.status}).`);
  }
}

const API = {
  async getAllStories() {
    const token = getAccessToken();
    if (!token) throw new Error('Token tidak tersedia. Silakan login ulang.');

    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleErrorResponse(response, 'Mengambil data cerita');
    }

    const data = await safeJsonParse(response);
    return data.listStory;
  },

  async getStoryDetail(id) {
    const token = getAccessToken();
    if (!token) throw new Error('Token tidak tersedia. Silakan login ulang.');

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleErrorResponse(response, 'Mengambil detail cerita');
    }

    const data = await safeJsonParse(response);
    return data.story;
  },

  async addStory({ description, photoFile, lat, lon }) {
    const token = getAccessToken();
    if (!token) throw new Error('Token tidak tersedia. Silakan login ulang.');

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photoFile);
    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      handleErrorResponse(response, 'Mengirim cerita baru');
    }

    const data = await safeJsonParse(response);
    return data;
  },

  async login({ email, password }) {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      handleErrorResponse(response, 'Login');
    }

    const data = await safeJsonParse(response);
    if (data.error) throw new Error(data.message);
    return data.loginResult;
  },

  async register({ name, email, password }) {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      handleErrorResponse(response, 'Registrasi');
    }

    const data = await safeJsonParse(response);
    if (data.error) throw new Error(data.message);
    return data;
  },
};

export default API;
