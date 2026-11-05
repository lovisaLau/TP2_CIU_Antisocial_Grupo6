// Funciones chicas para mostrar datos de forma prolija.
export const formatearFecha = (fechaISO?: string): string => {
  if (!fechaISO) return '';
  return new Date(fechaISO).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// 1 → "1 comentario", 3 → "3 comentarios"
export const textoComentarios = (cantidad: number): string =>
  `${cantidad} ${cantidad === 1 ? 'comentario' : 'comentarios'}`;

// Revisa que un texto sea una URL que empiece con http:// o https://
export const esUrlValida = (texto: string): boolean => {
  try {
    const url = new URL(texto);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
