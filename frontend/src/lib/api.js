const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getProducts(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value);
        }
    });

    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function getProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export async function getBrands() {
    const res = await fetch(`${API_URL}/brands`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

// Auth API
export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al iniciar sesión');
    }

    return res.json();
}

export async function register(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al registrarse');
    }

    return res.json();
}

export async function getProfile(token) {
    const res = await fetch(`${API_URL}/auth/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error('Sesión inválida');
    }

    return res.json();
}

export async function forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al solicitar recuperación');
    }

    return res.json();
}

export async function resetPassword(token, newPassword) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al restablecer contraseña');
    }

    return res.json();
}

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const session = localStorage.getItem('userSession');
    const token = session ? JSON.parse(session).token : null;

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al subir la imagen');
    }

    return res.json();
}
