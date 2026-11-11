import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { iniciarSesion } from '../services/api';

interface Errores {
  nickName?: string;
  password?: string;
}

const Login = () => {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si vino desde una ruta protegida, RutaProtegida guardó a dónde quería ir
  const destino = (location.state as { desde?: string } | null)?.desde ?? '/';

  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (usuario) return <Navigate to={destino} replace />;

  const validar = (): boolean => {
    const nuevos: Errores = {};
    if (!nickName.trim()) nuevos.nickName = 'Ingresá tu nickName.';
    if (!password) nuevos.password = 'Ingresá tu contraseña.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorServidor('');
    if (!validar()) return;

    try {
      setEnviando(true);
      // BONUS contraseña propia: el BackEnd valida nickName y contraseña (POST /users/login)
      const respuesta = await iniciarSesion(nickName.trim(), password);
      login(respuesta.usuario); // se guarda en el contexto y en localStorage
      navigate(destino, { replace: true });
    } catch (err) {
      // Por ejemplo: "Usuario o contraseña incorrectos" (401)
      setErrorServidor(err instanceof Error ? err.message : 'No se pudo iniciar sesión.');
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
              <h1 className="h3 fw-bold mb-1">Iniciar sesión</h1>
              <p className="text-muted mb-4">Qué bueno verte de nuevo (pero no tanto).</p>

              {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}

              <Form onSubmit={manejarEnvio} noValidate>
                <Form.Group controlId="nickName" className="mb-3">
                  <Form.Label>NickName</Form.Label>
                  <Form.Control
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    isInvalid={!!errores.nickName}
                    autoComplete="username"
                  />
                  <Form.Control.Feedback type="invalid">{errores.nickName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={verPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={!!errores.password}
                      autoComplete="current-password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setVerPassword(!verPassword)}
                      aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {verPassword ? '🙈' : '👁️'}
                    </Button>
                    <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" size="lg" className="w-100" disabled={enviando}>
                  {enviando ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0">
                ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
              </p>
              <p className="text-center text-muted small mt-2 mb-0">
                Usuarios de prueba: laura, marilin, mili o silvina · contraseña 123456
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
