import { ErrorType } from "../utils/errorTypes";
import { Messages } from "../utils/messages";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);;
    if (!res.ok) {
      const error = new Error(Messages.UNKNOWN_ERROR);
      error.type = ErrorType.UNKNOWN;
      throw error;
    }
    const data = await res.json();
    if (!data.payload || data.payload.length === 0) {
      const error = new Error("No se pudieron obtener productos (la lista está vacía o posible problema de conexión)");
      error.type = ErrorType.NETWORK_ERROR;
      throw error;
    }

    return data.payload;
  } catch (err) {
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      const error = new Error("No hay conexión con la API");
      error.type = ErrorType.NETWORK_ERROR;
      throw error;
    }
    throw err;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (res.status === 404) {
      const error = new Error("Producto no encontrado");
      error.type = ErrorType.NOT_FOUND;
      throw error;
    }

    if (!res.ok) {
      const error = new Error(Messages.UNKNOWN_ERROR);
      error.type = ErrorType.UNKNOWN;
      throw error;
    }

    const data = await res.json();
    return data.payload;
  } catch (err) {
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      const error = new Error("No hay conexión con la API");
      error.type = ErrorType.NETWORK_ERROR;
      throw error;
    }
    throw err;
  }
}

// Crear producto (requiere rol admin)
export async function createProduct(product) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(product),
  });

  if (res.status === 401) {
    const error = new Error(Messages.SESSION_EXPIRED);
    error.type = ErrorType.SESSION_EXPIRED;
    throw error;
  }

  if (res.status === 400) {
    const error = new Error(Messages.VALIDATION_ERROR);
    error.type = ErrorType.VALIDATION_ERROR;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(Messages.UNKNOWN_ERROR);
    error.type = ErrorType.UNKNOWN;
    throw error;
  }

  const data = await res.json();
  return data.payload;
}

// Actualizar producto (requiere admin)
export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(product),
  });

  if (res.status === 401) {
    const error = new Error(Messages.SESSION_EXPIRED);
    error.type = ErrorType.SESSION_EXPIRED;
    throw error;
  }

  if (res.status === 400) {
    const error = new Error(Messages.VALIDATION_ERROR);
    error.type = ErrorType.VALIDATION_ERROR;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(Messages.UNKNOWN_ERROR);
    error.type = ErrorType.UNKNOWN;
    throw error;
  }

  const data = await res.json();
  return data.payload;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    const error = new Error(Messages.SESSION_EXPIRED);
    error.type = ErrorType.SESSION_EXPIRED;    
    throw error;
  }

  const data = await res.json();
  return data.payload;
}

