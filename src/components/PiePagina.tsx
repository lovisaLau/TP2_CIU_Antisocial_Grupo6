import { Container } from 'react-bootstrap';

const ANIO_ACTUAL = new Date().getFullYear();

const PiePagina = () => {
  return (
    <footer className="pie-pagina py-4 mt-5">
      <Container className="text-center small">
        <p className="mb-1 fw-semibold">UnaHur Anti-Social Net</p>
        <p className="mb-0 text-white-50">
          La red social para los que no son muy sociales · Trabajo Práctico 2 de Construcción de
          Interfaces de Usuario (UNAHUR) · {ANIO_ACTUAL}
        </p>
      </Container>
    </footer>
  );
};

export default PiePagina;
