import { useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BarraNavegacion = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Menú hamburguesa controlado: se cierra solo al elegir una opción en el celular
  const [expandido, setExpandido] = useState(false);
  const cerrarMenu = () => setExpandido(false);

  const cerrarSesion = () => {
    cerrarMenu();
    // Primero se va al inicio y después se borra la sesión
    navigate('/');
    logout();
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      expanded={expandido}
      onToggle={(abierto) => setExpandido(abierto)}
      className="barra-navegacion"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu} className="fw-bold">
          <span aria-hidden="true">🙃</span> UnaHur <span className="text-acento">Anti-Social</span> Net
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            <Nav.Link as={NavLink} to="/" end onClick={cerrarMenu}>
              Inicio
            </Nav.Link>

            {usuario ? (
              <>
                <Nav.Link as={NavLink} to="/nueva-publicacion" onClick={cerrarMenu}>
                  Nueva publicación
                </Nav.Link>
                <Nav.Link as={NavLink} to="/perfil" onClick={cerrarMenu}>
                  Mi perfil (@{usuario.nickName})
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-2 mt-2 mt-lg-0"
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" onClick={cerrarMenu}>
                  Iniciar sesión
                </Nav.Link>
                <Link to="/registro" onClick={cerrarMenu} className="btn btn-light btn-sm ms-lg-2 mt-2 mt-lg-0">
                  Registrarme
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
