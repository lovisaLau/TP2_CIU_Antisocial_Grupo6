import type { Imagen } from '../types';

interface Props {
  imagenes: Imagen[];
  maximo?: number; // cuántas mostrar como máximo (en el feed se muestran menos)
}

// Muestra las imágenes de una publicación en una grilla.
// Si hay más imágenes que el máximo, la última muestra "+N".
const GaleriaImagenes = ({ imagenes, maximo = 4 }: Props) => {
  if (imagenes.length === 0) return null;

  const visibles = imagenes.slice(0, maximo);
  const restantes = imagenes.length - visibles.length;

  return (
    <div className={`galeria galeria-${Math.min(visibles.length, 4)}`}>
      {visibles.map((imagen, indice) => (
        <div key={imagen.id} className="galeria-item">
          <img
            src={imagen.url}
            alt={`Imagen ${indice + 1} de la publicación`}
            loading="lazy"
            // si la URL no carga, se oculta la imagen en vez de mostrar el ícono roto
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          {restantes > 0 && indice === visibles.length - 1 && (
            <span className="galeria-mas">+{restantes}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GaleriaImagenes;
