import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Cargando from '../components/Cargando';
import { useAuth } from '../context/AuthContext';
import { obtenerPublicacionesDeUsuario } from '../services/api';
import type { Publicacion } from '../types';
import { formatearFecha, textoComentarios } from '../utils/formato';

// Vista protegida: solo se llega con sesión iniciada (ver RutaProtegida en App.tsx)
const Perfil = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const userId = usuario?.id;

  // Publicaciones del usuario, consultadas a la API con su userId
  useEffect(() => {
    if (userId === undefined) return;
    let activo = true;

    obtenerPublicacionesDeUsuario(userId)
      .then((posts) => {
        if (!activo) return;
        const ordenadas = [...posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPublicaciones(ordenadas);
      })
      .catch((err: Error) => activo && setError(err.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [userId]);

  const cerrarSesion = () => {
    // Primero se sale de la página protegida y después se borra la sesión
    navigate('/');
    logout();
  };

  if (!usuario) return null; // RutaProtegida ya lo evita, pero TypeScript necesita el control

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="tarjeta-publicacion text-center">
            <Card.Body className="p-4">
              <span className="avatar avatar-grande mx-auto mb-3" aria-hidden="true">
                {usuario.nickName.charAt(0).toUpperCase()}
              </span>
              <h1 className="h3 fw-bold mb-1">@{usuario.nickName}</h1>
              {usuario.createdAt && (
                <p className="text-muted small mb-3">
                  Miembro desde el {formatearFecha(usuario.createdAt)}
                </p>
              )}
              <p className="mb-4">
                <strong>{publicaciones.length}</strong>{' '}
                {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
              </p>
              <div className="d-grid gap-2">
                <Link to="/nueva-publicacion" className="btn btn-primary">
                  Nueva publicación
                </Link>
                <Button variant="outline-danger" onClick={cerrarSesion}>
                  Cerrar sesión
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <h2 className="h4 fw-bold mb-3">Mis publicaciones</h2>

          {cargando && <Cargando texto="Cargando tus publicaciones..." />}
          {error && <Alert variant="danger">{error}</Alert>}

          {!cargando && !error && publicaciones.length === 0 && (
            <Card className="tarjeta-publicacion">
              <Card.Body className="text-center p-5">
                <p className="text-muted">Todavía no publicaste nada.</p>
                <Link to="/nueva-publicacion" className="btn btn-primary">
                  Crear mi primera publicación
                </Link>
              </Card.Body>
            </Card>
          )}

          {publicaciones.length > 0 && (
            <ListGroup className="lista-perfil">
              {publicaciones.map((publicacion) => (
                <ListGroup.Item
                  key={publicacion.id}
                  className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-3 aparecer"
                >
                  <div className="me-sm-3">
                    <p className="mb-1 descripcion">{publicacion.description}</p>
                    <small className="text-muted">
                      {formatearFecha(publicacion.createdAt)} · 💬{' '}
                      {textoComentarios(publicacion.comments.length)}
                    </small>
                  </div>
                  <Link to={`/post/${publicacion.id}`} className="btn btn-outline-primary btn-sm flex-shrink-0">
                    Ver más
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
