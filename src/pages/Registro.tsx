import { useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrarUsuario } from '../services/api';

interface Campos {
  nickName: string;
  password: string;
  confirmacion: string;
}

type Errores = Partial<Record<keyof Campos, string>>;

const camposIniciales: Campos = { nickName: '', password: '', confirmacion: '' };

// Mismas reglas que valida el BackEnd con Joi
const PATRON_NICKNAME = /^[a-zA-Z0-9._-]+$/;

const Registro = () => {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();

  const [campos, setCampos] = useState<Campos>(camposIniciales);
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/perfil" replace />;

  // Un solo manejador para los tres campos, gracias al atributo name
  const manejarCambio = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampos({ ...campos, [name]: value });
    if (errores[name as keyof Campos]) {
      setErrores({ ...errores, [name]: undefined });
    }
  };

  const validar = (): boolean => {
    const nuevos: Errores = {};
    const nick = campos.nickName.trim();

    if (!nick) nuevos.nickName = 'El nickName es obligatorio.';
    else if (nick.length < 3 || nick.length > 30)
      nuevos.nickName = 'Tiene que tener entre 3 y 30 caracteres.';
    else if (!PATRON_NICKNAME.test(nick))
      nuevos.nickName = 'Solo letras, números, puntos, guiones y guiones bajos (sin espacios).';

    if (!campos.password) nuevos.password = 'La contraseña es obligatoria.';
    else if (campos.password.length < 6)
      nuevos.password = 'La contraseña tiene que tener al menos 6 caracteres.';

    if (!campos.confirmacion) nuevos.confirmacion = 'Repetí la contraseña.';
    else if (campos.confirmacion !== campos.password)
      nuevos.confirmacion = 'Las contraseñas no coinciden.';

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorServidor('');
    if (!validar()) return; // antes de enviar, los campos tienen que estar completos

    try {
      setEnviando(true);
      const respuesta = await registrarUsuario(campos.nickName.trim(), campos.password);
      // Registro exitoso: se loguea directamente al usuario nuevo
      login(respuesta.usuario);
      navigate('/perfil', { replace: true });
    } catch (err) {
      // Por ejemplo: "El nickName ya está en uso" (409), validado por el BackEnd
      setErrorServidor(err instanceof Error ? err.message : 'No se pudo crear el usuario.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="tarjeta-publicacion">
            <Card.Body className="p-4 p-md-5">
              <h1 className="h3 fw-bold mb-1">Crear cuenta</h1>
              <p className="text-muted mb-4">Sumate a la red menos social de la UNAHUR.</p>

              {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}

              <Form onSubmit={manejarEnvio} noValidate>
                <Form.Group controlId="registro-nickName" className="mb-3">
                  <Form.Label>NickName *</Form.Label>
                  <Form.Control
                    name="nickName"
                    value={campos.nickName}
                    onChange={manejarCambio}
                    isInvalid={!!errores.nickName}
                    autoComplete="username"
                  />
                  <Form.Control.Feedback type="invalid">{errores.nickName}</Form.Control.Feedback>
                  <Form.Text>Entre 3 y 30 caracteres, sin espacios.</Form.Text>
                </Form.Group>

                <Form.Group controlId="registro-password" className="mb-3">
                  <Form.Label>Contraseña *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={campos.password}
                    onChange={manejarCambio}
                    isInvalid={!!errores.password}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="registro-confirmacion" className="mb-4">
                  <Form.Label>Repetir contraseña *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmacion"
                    value={campos.confirmacion}
                    onChange={manejarCambio}
                    isInvalid={!!errores.confirmacion}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">{errores.confirmacion}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" size="lg" className="w-100" disabled={enviando}>
                  {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro;
