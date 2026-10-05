import { Link } from 'react-router-dom';
import { formatearFecha } from '../utils/formatearFecha.js';

export default function CharlaCard({ charla }) {
  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column p-4">
        <h2 className="h5 card-title">{charla.nombre}</h2>
        <p className="card-text text-secondary">{charla.tema}</p>
        <dl>
          <dt>Fecha</dt>
          <dd><time dateTime={charla.fecha}>{formatearFecha(charla.fecha)}</time></dd>
          <dt>Horario</dt>
          <dd>{charla.horario} h</dd>
          <dt>Sede</dt>
          <dd>{charla.sede.nombre}</dd>
        </dl>
        <Link
          className="btn btn-primary mt-auto align-self-start"
          to={`/charlas/${charla.id}`}
          aria-label={`Ver detalle de ${charla.nombre}`}
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
