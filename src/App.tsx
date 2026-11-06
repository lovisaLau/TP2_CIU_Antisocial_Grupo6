import { Route, Routes } from 'react-router-dom';
import BarraNavegacion from './components/BarraNavegacion';
import CambioDeRuta from './components/CambioDeRuta';
import PiePagina from './components/PiePagina';
import RutaProtegida from './components/RutaProtegida';
import { AuthProvider } from './context/AuthContext';
import DetallePublicacion from './pages/DetallePublicacion';
import Home from './pages/Home';
import Login from './pages/Login';
import NoEncontrada from './pages/NoEncontrada';
import NuevaPublicacion from './pages/NuevaPublicacion';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';

function App() {
  return (
    // AuthProvider envuelve toda la app: cualquier componente puede saber quién inició sesión
    <AuthProvider>
      <CambioDeRuta />
      <div className="d-flex flex-column min-vh-100">
        <BarraNavegacion />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/post/:id" element={<DetallePublicacion />} />

            {/* Rutas protegidas: solo con sesión iniciada */}
            <Route
              path="/perfil"
              element={
                <RutaProtegida>
                  <Perfil />
                </RutaProtegida>
              }
            />
            <Route
              path="/nueva-publicacion"
              element={
                <RutaProtegida>
                  <NuevaPublicacion />
                </RutaProtegida>
              }
            />

            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>
        <PiePagina />
      </div>
    </AuthProvider>
  );
}

export default App;
