import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';

// Lo que comparte el contexto con toda la app
interface AuthContextTipo {
  usuario: Usuario | null; // null = nadie inició sesión
  login: (usuario: Usuario) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextTipo | null>(null);

const CLAVE_STORAGE = 'usuario_antisocial';

// Lee la sesión guardada. Si el dato está roto, arranca sin sesión.
const leerUsuarioGuardado = (): Usuario | null => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    return guardado ? (JSON.parse(guardado) as Usuario) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado);

  // Cada vez que cambia el usuario, se guarda (o se borra) en localStorage.
  // Así la sesión sigue aunque se recargue la página.
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(CLAVE_STORAGE);
    }
  }, [usuario]);

  const login = (usuarioLogueado: Usuario) => setUsuario(usuarioLogueado);
  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>
  );
};

// Hook para usar el contexto: const { usuario, login, logout } = useAuth();
// oxlint-disable-next-line react/only-export-components
export const useAuth = (): AuthContextTipo => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth tiene que usarse dentro de <AuthProvider>');
  }
  return contexto;
};