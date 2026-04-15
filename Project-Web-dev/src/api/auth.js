const API_URL = import.meta.env.VITE_API_URL;

// ✅ REGISTRO
export const registro = async (user) => {
  const res = await fetch(`${API_URL}/api/auth/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  return res.json();
};

// ✅ LOGIN
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({correo_electronico: email, password })
  });

  const data = await res.json();

  // 🔥 guardar token
  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

export const logout = async () => {
  try {
    await fetchConToken('/api/auth/logout', { method: 'POST' });
  } catch (_) {}
  removeToken();
};

/*
export const loginConGoogle = async (idToken) => {
    const data = await fetchSinToken('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
    });
    return data;
};
*/ 

