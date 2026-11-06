import { Spinner } from 'react-bootstrap';

interface Props {
  texto?: string;
}

// Se muestra mientras se espera la respuesta de la API
const Cargando = ({ texto = 'Cargando...' }: Props) => {
  return (
    <div className="text-center py-5 text-muted" role="status">
      <Spinner animation="border" className="mb-2" />
      <p className="mb-0">{texto}</p>
    </div>
  );
};

export default Cargando;
