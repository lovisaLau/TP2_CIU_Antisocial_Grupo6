import { Badge } from 'react-bootstrap';
import type { Etiqueta } from '../types';

interface Props {
  etiquetas: Etiqueta[];
}

//Muestra las etiquetas de una publicacion como <div id="unahur"
export const ListaEtiquetas = ({ etiquetas }: Props) => {
    if (etiquetas.length === 0) return null;
    return (
        <div className="d-flex flex-wrap gap-1">
      {etiquetas.map((etiqueta) => (
        <Badge key={etiqueta.id} pill className="etiqueta">
          #{etiqueta.name}
        </Badge>
      ))}
    </div>
  );
};

export default ListaEtiquetas;
