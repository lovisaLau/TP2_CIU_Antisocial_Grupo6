import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titulos: Record<string, string> = {
  '/': 'Inicio',
  '/login': 'Iniciar sesión',
  '/registro': 'Registrarme',
  '/perfil': 'Mi perfil',
  '/nueva-publicacion': 'Nueva publicación',
};

// No dibuja nada: en cada cambio de ruta sube la página y cambia el título de la pestaña
const CambioDeRuta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const titulo = pathname.startsWith('/post/')
      ? 'Publicación'
      : (titulos[pathname] ?? 'Página no encontrada');
    document.title = `${titulo} | UnaHur Anti-Social Net`;
  }, [pathname]);

  return null;
};

export default CambioDeRuta;
