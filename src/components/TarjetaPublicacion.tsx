import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Publicacion } from '../types';
import { formatearFecha, textoComentarios } from '../utils/formato';
import GaleriaImagenes from './GaleriaImagenes';
import ListaEtiquetas from './ListaEtiquetas';

interface Props {
  publicacion: Publicacion;
  destacada?: boolean; // muestra la cinta "Destacada"
}

// Una publicacion del feed: autor, descripcion, imagenes, etiquetas,
// cantidad de comentarios visibles y boton "Ver más".
const TarjetaPublicacion = ({ publicacion, destacada = false }: Props) => {
  const { id, description, user, createdAt, images, tags, comments } = publicacion;

  return (
    <Card className={`tarjeta-publicacion aparecer h-100 ${destacada ? 'destacada' : ''}`}>
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="avatar" aria-hidden="true">
            {user?.nickName.charAt(0).toUpperCase() ?? '?'}
          </span>
          <div className="lh-sm">
            <span className="fw-semibold">@{user?.nickName ?? 'anónimo'}</span>
            <small className="d-block text-muted">{formatearFecha(createdAt)}</small>
          </div>
          {destacada && <span className="cinta-destacada ms-auto">⭐ Destacada</span>}
        </div>

        <Card.Text className="descripcion mb-0">{description}</Card.Text>

        <GaleriaImagenes imagenes={images} maximo={4} />

        <ListaEtiquetas etiquetas={tags} />

        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <small className="text-muted">💬 {textoComentarios(comments.length)}</small>
          <Link to={`/post/${id}`} className="btn btn-primary btn-sm">
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaPublicacion;
