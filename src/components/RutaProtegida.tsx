import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

// Envuelve las páginas que solo puede ver alguien con sesión iniciada.
// Si no hay usuario, lo manda al login y recuerda a qué página quería ir.
const RutaProtegida = ({ children }: Props) => {
  const { usuario } = useAuth();
  const location = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  return children;
};

export default RutaProtegida;
