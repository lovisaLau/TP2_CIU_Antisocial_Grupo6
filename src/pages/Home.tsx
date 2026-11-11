import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import Cargando from '../components/Cargando';
import TarjetaPublicacion from '../components/TarjetaPublicacion';
import { useAuth } from '../context/AuthContext';
import { obtenerEtiquetas, obtenerPublicaciones } from '../services/api';
import type { Etiqueta, Publicacion } from '../types';

const POR_PAGINA = 6;

const datosCuriosos = [
  'Acá no hay "me gusta": si algo te gustó, comentalo.',
  'Los comentarios con más de 6 meses desaparecen solos. Nada es para siempre.',
  'No hay seguidores que contar. Solo publicaciones y charlas.',
];

const Home = () => {
  const { usuario } = useAuth();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [cantidadVisible, setCantidadVisible] = useState(POR_PAGINA);

  // BONUS filtro por etiquetas: la etiqueta elegida queda en la URL (?etiqueta=node)
  const [searchParams, setSearchParams] = useSearchParams();
  const etiquetaElegida = searchParams.get('etiqueta') ?? '';

  // Carga las publicaciones y las etiquetas una sola vez, al entrar a la página
  useEffect(() => {
    let activo = true; // evita actualizar el estado si la persona ya se fue de la página

    Promise.all([obtenerPublicaciones(), obtenerEtiquetas()])
      .then(([posts, tags]) => {
        if (!activo) return;
        // Feed de publicaciones recientes: de la más nueva a la más vieja
        const ordenadas = [...posts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setPublicaciones(ordenadas);
        setEtiquetas(tags);
      })
      .catch((err: Error) => activo && setError(err.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  const elegirEtiqueta = (nombre: string) => {
    setSearchParams(nombre ? { etiqueta: nombre } : {});
    setCantidadVisible(POR_PAGINA); // al cambiar el filtro, vuelve a la primera "página"
  };

  const filtradas = etiquetaElegida
    ? publicaciones.filter((p) => p.tags.some((t) => t.name === etiquetaElegida))
    : publicaciones;

  // BONUS publicación destacada: la que tiene más comentarios visibles
  const destacada = publicaciones.reduce<Publicacion | null>(
    (mejor, p) => (!mejor || p.comments.length > mejor.comments.length ? p : mejor),
    null,
  );

  const totalComentarios = publicaciones.reduce((total, p) => total + p.comments.length, 0);

  return (
    <>
      {/* Banner de bienvenida */}
      <section className="banner text-white">
        <Container className="py-5">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <p className="text-uppercase small fw-semibold mb-2 opacity-75">
                La red social de la UNAHUR
              </p>
              <h1 className="display-5 fw-bold mb-3">
                Bienvenidos a la red social para los que no son muy sociales
              </h1>
              <p className="fs-5 mb-4 opacity-75">
                Publicá lo que pensás, sumá imágenes y etiquetas, y charlá en los comentarios. Sin
                likes, sin seguidores, sin presión.
              </p>
              {usuario ? (
                <Link to="/nueva-publicacion" className="btn btn-light btn-lg">
                  Crear una publicación
                </Link>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/registro" className="btn btn-light btn-lg">
                    Crear mi cuenta
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    Ya tengo cuenta
                  </Link>
                </div>
              )}
            </Col>
            <Col lg={5}>
              <div className="banner-datos">
                <div>
                  <strong>{publicaciones.length}</strong>
                  <span>publicaciones</span>
                </div>
                <div>
                  <strong>{totalComentarios}</strong>
                  <span>comentarios visibles</span>
                </div>
                <div>
                  <strong>{etiquetas.length}</strong>
                  <span>etiquetas</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {cargando && <Cargando texto="Cargando publicaciones..." />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!cargando && !error && (
          <>
            {destacada && destacada.comments.length > 0 && !etiquetaElegida && (
              <section className="mb-5">
                <h2 className="h4 fw-bold mb-3">La más comentada</h2>
                <TarjetaPublicacion publicacion={destacada} destacada />
              </section>
            )}

            <section aria-labelledby="titulo-feed">
              <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
                <h2 id="titulo-feed" className="h4 fw-bold mb-0">
                  Publicaciones recientes
                </h2>
                <small className="text-muted" aria-live="polite">
                  Mostrando {Math.min(cantidadVisible, filtradas.length)} de {filtradas.length}
                </small>
              </div>

              {/* BONUS filtro por etiquetas */}
              <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar por etiqueta">
                <Button
                  size="sm"
                  variant={etiquetaElegida ? 'outline-secondary' : 'secondary'}
                  onClick={() => elegirEtiqueta('')}
                >
                  Todas
                </Button>
                {etiquetas.map((etiqueta) => (
                  <Button
                    key={etiqueta.id}
                    size="sm"
                    variant={etiquetaElegida === etiqueta.name ? 'secondary' : 'outline-secondary'}
                    onClick={() => elegirEtiqueta(etiqueta.name)}
                  >
                    #{etiqueta.name}
                  </Button>
                ))}
              </div>

              {filtradas.length === 0 ? (
                <p className="text-muted text-center py-4">
                  Todavía no hay publicaciones con esa etiqueta.
                </p>
              ) : (
                <Row className="g-4">
                  {filtradas.slice(0, cantidadVisible).map((publicacion) => (
                    <Col key={publicacion.id} xs={12} md={6} xl={4}>
                      <TarjetaPublicacion publicacion={publicacion} />
                    </Col>
                  ))}
                </Row>
              )}

              {/* BONUS paginación: muestra de a 6 */}
              {cantidadVisible < filtradas.length && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => setCantidadVisible(cantidadVisible + POR_PAGINA)}
                  >
                    Ver más publicaciones
                  </Button>
                </div>
              )}
            </section>
          </>
        )}

        {/* Sobre nosotros */}
        <section className="sobre-nosotros mt-5 p-4 p-md-5">
          <Row className="g-4 align-items-center">
            <Col md={6}>
              <h2 className="h4 fw-bold">Sobre nosotros</h2>
              <p className="mb-0">
                UnaHur Anti-Social Net es un proyecto de estudiantes de la Universidad Nacional de
                Hurlingham. Es el FrontEnd en React y TypeScript de la API que hicimos en Estrategias
                de Persistencia: una red social simple, donde lo importante es lo que se dice.
              </p>
            </Col>
            <Col md={6}>
              <h3 className="h6 fw-bold text-uppercase text-muted">¿Sabías que...?</h3>
              <ul className="mb-0">
                {datosCuriosos.map((dato) => (
                  <li key={dato}>{dato}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default Home;
