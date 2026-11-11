import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { agregarImagen, crearPublicacion, obtenerEtiquetas } from '../services/api';
import type { Etiqueta } from '../types';
import { esUrlValida } from '../utils/formato';

interface Errores {
  descripcion?: string;
  urls?: string[]; 
}

const NuevaPublicacion = () => {
  const { usuario } = useAuth();

  // Campos del formulario controlado
  const [descripcion, setDescripcion] = useState('');
  const [urls, setUrls] = useState<string[]>(['']); 
  const [etiquetasElegidas, setEtiquetasElegidas] = useState<number[]>([]);

  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [idCreado, setIdCreado] = useState<number | null>(null);

  // Lista de etiquetas obtenida desde la API (GET /tags)
  useEffect(() => {
    obtenerEtiquetas()
      .then(setEtiquetas)
      .catch(() => setErrorServidor('No se pudieron cargar las etiquetas.'));
  }, []);

  // Campos de URL: cambiar, agregar y quitar (siempre creando arrays nuevos)
  const cambiarUrl = (indice: number, valor: string) => {
    setUrls(urls.map((url, i) => (i === indice ? valor : url)));
  };
  const agregarCampoUrl = () => setUrls([...urls, '']);
  const quitarCampoUrl = (indice: number) => setUrls(urls.filter((_, i) => i !== indice));

  const alternarEtiqueta = (id: number) => {
    setEtiquetasElegidas(
      etiquetasElegidas.includes(id)
        ? etiquetasElegidas.filter((elegida) => elegida !== id)
        : [...etiquetasElegidas, id],
    );
  };

  const validar = (): boolean => {
    const nuevos: Errores = {};
    if (!descripcion.trim()) nuevos.descripcion = 'La descripción es obligatoria.';

    const erroresUrls = urls.map((url) =>
      url.trim() && !esUrlValida(url.trim()) ? 'Ingresá una URL válida (https://...).' : '',
    );
    if (erroresUrls.some((mensaje) => mensaje)) nuevos.urls = erroresUrls;

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorServidor('');
    if (!validar() || !usuario) return;

    try {
      setEnviando(true);

      // POST /posts con description, userId y tags
      const publicacion = await crearPublicacion({
        description: descripcion.trim(),
        userId: usuario.id,
        tags: etiquetasElegidas,
      });

      // Por cada URL cargada, se asocia la imagen al post nuevo
      const urlsCargadas = urls.map((url) => url.trim()).filter((url) => url !== '');
      for (const url of urlsCargadas) {
        await agregarImagen(publicacion.id, url);
      }

      // Confirmación
      setIdCreado(publicacion.id);
    } catch (err) {
      setErrorServidor(err instanceof Error ? err.message : 'No se pudo crear la publicación.');
    } finally {
      setEnviando(false);
    }
  };

  const empezarDeNuevo = () => {
    setDescripcion('');
    setUrls(['']);
    setEtiquetasElegidas([]);
    setIdCreado(null);
  };

  // Pantalla de confirmación
  if (idCreado !== null) {
    return (
      <Container className="py-5">
        <Alert variant="success" className="p-4 p-md-5 text-center aparecer">
          <h1 className="h3 fw-bold">¡Publicación creada! 🎉</h1>
          <p className="mb-4">Ya está en el feed para que la vea todo el mundo.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link to={`/post/${idCreado}`} className="btn btn-success">
              Ver mi publicación
            </Link>
            <Link to="/perfil" className="btn btn-outline-success">
              Ir a mi perfil
            </Link>
            <Button variant="link" onClick={empezarDeNuevo}>
              Crear otra
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="fw-bold mb-4">Nueva publicación</h1>
          <Card className="tarjeta-publicacion">
            <Card.Body className="p-4">
              {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}

              <Form onSubmit={manejarEnvio} noValidate>
                <Form.Group controlId="descripcion" className="mb-4">
                  <Form.Label className="fw-semibold">Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="¿Qué querés contar?"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    isInvalid={!!errores.descripcion}
                  />
                  <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
                </Form.Group>

                <fieldset className="mb-4">
                  <legend className="fs-6 fw-semibold">Imágenes (opcional)</legend>
                  {urls.map((url, indice) => (
                    <Form.Group key={indice} controlId={`url-${indice}`} className="mb-2">
                      <Form.Label visuallyHidden>URL de la imagen {indice + 1}</Form.Label>
                      <div className="d-flex gap-2 align-items-start">
                        <div className="flex-grow-1">
                          <Form.Control
                            type="url"
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={url}
                            onChange={(e) => cambiarUrl(indice, e.target.value)}
                            isInvalid={!!errores.urls?.[indice]}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errores.urls?.[indice]}
                          </Form.Control.Feedback>
                        </div>
                        {urls.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => quitarCampoUrl(indice)}
                            aria-label={`Quitar la URL ${indice + 1}`}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    </Form.Group>
                  ))}
                  <Button variant="outline-secondary" size="sm" onClick={agregarCampoUrl}>
                    + Agregar otra imagen
                  </Button>
                </fieldset>

                <fieldset className="mb-4">
                  <legend className="fs-6 fw-semibold">Etiquetas</legend>
                  {etiquetas.length === 0 ? (
                    <p className="text-muted small mb-0">No hay etiquetas para elegir.</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      {etiquetas.map((etiqueta) => (
                        <Form.Check
                          key={etiqueta.id}
                          type="checkbox"
                          id={`etiqueta-${etiqueta.id}`}
                          label={`#${etiqueta.name}`}
                          checked={etiquetasElegidas.includes(etiqueta.id)}
                          onChange={() => alternarEtiqueta(etiqueta.id)}
                        />
                      ))}
                    </div>
                  )}
                </fieldset>

                <Button type="submit" size="lg" className="w-100" disabled={enviando}>
                  {enviando ? 'Publicando...' : 'Publicar'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NuevaPublicacion;
