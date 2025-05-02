const API_BASE_URL = 'http://localhost:5000/api';

export const fetchData = async (endpoint, method = 'GET', body = null) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    });
    return await res.json();
  } catch (error) {
    console.error('API error:', error);
    return { error: error.message };
  }
};
