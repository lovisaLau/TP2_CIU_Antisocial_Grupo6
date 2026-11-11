import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import Cargando from '../components/Cargando';
import FormularioComentario from '../components/FormularioComentario';
import GaleriaImagenes from '../components/GaleriaImagenes';
import ListaEtiquetas from '../components/ListaEtiquetas';
import { useAuth } from '../context/AuthContext';
import { obtenerPublicacion } from '../services/api';
import type { Publicacion } from '../types';
import { formatearFecha, textoComentarios } from '../utils/formato';

const DetallePublicacion = () => {
  const { id } = useParams();                  
  const { usuario } = useAuth();
  const location = useLocation();

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // Cada vez que cambia, el useEffect vuelve a pedir la publicación (ej. al comentar)
  const [recargas, setRecargas] = useState(0);

  useEffect(() => {
    let activo = true;

    obtenerPublicacion(Number(id))
      .then((datos) => {
        if (!activo) return;
        setPublicacion(datos);
        setError('');
      })
      .catch((err: Error) => activo && setError(err.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [id, recargas]);

  if (cargando) return <Cargando texto="Cargando publicación..." />;

  if (error || !publicacion) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning" className="d-inline-block">
          {error || 'No encontramos la publicación.'}
        </Alert>
        <div>
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </Container>
    );
  }

  const { description, user, createdAt, images, tags, comments } = publicacion;

  // Comentarios del más viejo al más nuevo
  const comentarios = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <Container className="py-5">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-4">
        ← Volver al feed
      </Link>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="tarjeta-publicacion">
            <Card.Body className="d-flex flex-column gap-3 p-4">
              <div className="d-flex align-items-center gap-2">
                <span className="avatar" aria-hidden="true">
                  {user?.nickName.charAt(0).toUpperCase() ?? '?'}
                </span>
                <div className="lh-sm">
                  <span className="fw-semibold">@{user?.nickName ?? 'anónimo'}</span>
                  <small className="d-block text-muted">{formatearFecha(createdAt)}</small>
                </div>
              </div>

              <h1 className="h4 fw-normal descripcion mb-0">{description}</h1>

              <GaleriaImagenes imagenes={images} maximo={images.length} />

              <ListaEtiquetas etiquetas={tags} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="tarjeta-publicacion">
            <Card.Body className="p-4">
              <h2 className="h5 fw-bold mb-3">💬 {textoComentarios(comentarios.length)}</h2>

              {comentarios.length === 0 ? (
                <p className="text-muted">Todavía nadie comentó. ¡Sé la primera persona!</p>
              ) : (
                <ListGroup variant="flush" className="mb-4">
                  {comentarios.map((comentario) => (
                    <ListGroup.Item key={comentario.id} className="px-0">
                      <div className="d-flex justify-content-between gap-2">
                        <span className="fw-semibold">@{comentario.user?.nickName ?? 'anónimo'}</span>
                        <small className="text-muted">{formatearFecha(comentario.createdAt)}</small>
                      </div>
                      <p className="mb-0 descripcion">{comentario.content}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {usuario ? (
                <FormularioComentario
                  postId={publicacion.id}
                  onComentarioCreado={() => setRecargas(recargas + 1)}
                />
              ) : (
                <Alert variant="info" className="mb-0">
                  Para comentar,{' '}
                  <Link to="/login" state={{ desde: location.pathname }}>
                    iniciá sesión
                  </Link>{' '}
                  o <Link to="/registro">creá tu cuenta</Link>.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetallePublicacion;
