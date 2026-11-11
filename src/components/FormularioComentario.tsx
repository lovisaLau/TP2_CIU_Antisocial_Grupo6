import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { crearComentario } from '../services/api';

interface Props {
  postId: number;
  onComentarioCreado: () => void;    // avisa al padre para que vuelva a pedir los comentarios
}

const MAXIMO = 500;

// Formulario controlado para comentar una publicación (POST /comments)
const FormularioComentario = ({ postId, onComentarioCreado }: Props) => {
  const { usuario } = useAuth();

  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const manejarEnvio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // que el navegador no recargue la página
    setErrorServidor('');
    setExito(false);

    // Validación: el campo es obligatorio
    if (!texto.trim()) {
      setError('Escribí un comentario antes de enviarlo.');
      return;
    }
    if (!usuario) return; // el padre solo muestra el formulario si hay sesión

    try {
      setEnviando(true);
      await crearComentario({ content: texto.trim(), userId: usuario.id, postId });
      setTexto('');
      setExito(true);
      onComentarioCreado();
    } catch (err) {
      setErrorServidor(err instanceof Error ? err.message : 'No se pudo publicar el comentario.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Form onSubmit={manejarEnvio} noValidate>
      {exito && (
        <Alert variant="success" dismissible onClose={() => setExito(false)} className="py-2">
          ¡Tu comentario se publicó!
        </Alert>
      )}
      {errorServidor && (
        <Alert variant="danger" className="py-2">
          {errorServidor}
        </Alert>
      )}

      <Form.Group controlId="nuevo-comentario" className="mb-2">
        <Form.Label className="fw-semibold">Dejá tu comentario</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          maxLength={MAXIMO}
          placeholder={`Comentá como @${usuario?.nickName}...`}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (error) setError(''); // se borra el error apenas empieza a corregir
          }}
          isInvalid={!!error}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        <Form.Text className="d-block text-end">
          {texto.length}/{MAXIMO}
        </Form.Text>
      </Form.Group>

      <Button type="submit" disabled={enviando}>
        {enviando ? 'Publicando...' : 'Comentar'}
      </Button>
    </Form>
  );
};

export default FormularioComentario;