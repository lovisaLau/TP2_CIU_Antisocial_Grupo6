import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NoEncontrada = () => {
    return (
        <Container className="py-5 text-center">
            <p className="display-1 fw-bold mb-0 text-acento">404</p>
            <p className="lead">La página que buscas no existe.</p>
            <h1 className="h3 mb-3">Esta página no existe (o no quiere halar con nadie)</h1>
            <p className="text-muted mb-4">Puede que el link esté mal escrito</p>
            <Link to="/" className="btn btn-primary">
                Volver al inicio
            </Link>
        </Container>
    )
}

export default NoEncontrada;