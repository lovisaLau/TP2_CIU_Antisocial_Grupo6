// Todos los pedidos a la API están en este archivo.
// Así, si cambia la dirección del BackEnd, se cambia en un solo lugar (.env).
import type {
  Comentario,
  DatosNuevaPublicacion,
  DatosNuevoComentario,
  Etiqueta,
  Imagen,
  Publicacion,
  RespuestaUsuario,
} from '../types';

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Función genérica: <T> es el tipo de dato que esperamos recibir.
// Hace el fetch, convierte la respuesta a JSON y, si la API respondió con un error,
// lanza un Error con el mensaje que mandó el servidor (para mostrarlo en pantalla).
async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisá que la API esté corriendo.');
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    // La API manda { message } y, si son errores de validación, también { errores: [...] }
    const mensaje: string =
      datos?.errores?.join(' ') ?? datos?.message ?? 'Ocurrió un error inesperado.';
    throw new Error(mensaje);
  }

  return datos as T;
}

// ---------- Usuarios ----------

// BONUS contraseña propia: el BackEnd valida nickName y contraseña
export const iniciarSesion = (nickName: string, password: string) =>
  pedir<RespuestaUsuario>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ nickName, password }),
  });

export const registrarUsuario = (nickName: string, password: string) =>
  pedir<RespuestaUsuario>('/users', {
    method: 'POST',
    body: JSON.stringify({ nickName, password }),
  });

// ---------- Publicaciones ----------

export const obtenerPublicaciones = () => pedir<Publicacion[]>('/posts');

export const obtenerPublicacion = (id: number) => pedir<Publicacion>(`/posts/${id}`);

// Nuestro BackEnd devuelve todos los posts aunque reciba ?userId,
// así que además filtramos acá por las dudas.
export const obtenerPublicacionesDeUsuario = async (userId: number) => {
  const publicaciones = await pedir<Publicacion[]>(`/posts?userId=${userId}`);
  return publicaciones.filter((publicacion) => publicacion.userId === userId);
};

export const crearPublicacion = (datos: DatosNuevaPublicacion) =>
  pedir<Publicacion>('/posts', {
    method: 'POST',
    body: JSON.stringify(datos),
  });

// En nuestro BackEnd, las imágenes se asocian con POST /posts/:id/images
export const agregarImagen = (postId: number, url: string) =>
  pedir<Imagen>(`/posts/${postId}/images`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

// ---------- Etiquetas y comentarios ----------

export const obtenerEtiquetas = () => pedir<Etiqueta[]>('/tags');

export const crearComentario = (datos: DatosNuevoComentario) =>
  pedir<Comentario>('/comments', {
    method: 'POST',
    body: JSON.stringify(datos),
  });