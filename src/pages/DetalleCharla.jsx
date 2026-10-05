import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MapaSede from '../components/MapaSede.jsx';
import { charlas } from '../data/charlas.js';
import { obtenerUbicacion } from '../services/usigService.js';
import { formatearFecha } from '../utils/formatearFecha.js';

export default function DetalleCharla() {
  const { id } = useParams();
  const charla = charlas.find((charla) => charla.id === id);
  const direccion = charla?.sede.direccion;
  const [consulta, setConsulta] = useState({ direccion: null, ubicacion: null, error: '' });

  useEffect(() => {
    if (direccion === undefined) return;

    const controlador = new AbortController();
    setConsulta({ direccion, ubicacion: null, error: '' });

    obtenerUbicacion(direccion, { signal: controlador.signal })
      .then((ubicacion) => {
        if (!controlador.signal.aborted) {
          setConsulta({ direccion, ubicacion, error: '' });
        }
      })
      .catch((error) => {
        if (!controlador.signal.aborted) {
          setConsulta({ direccion, ubicacion: null, error: error.message });
        }
      });

    // Al cambiar de dirección o salir del detalle, se cancela la consulta anterior.
    return () => controlador.abort();
  }, [direccion]);

  // Evita mostrar el mapa anterior mientras comienza la consulta de otra sede.
  const cargando = consulta.direccion !== direccion || (!consulta.ubicacion && !consulta.error);

  if (!charla) {
    return (
      <section>
        <h1 className="h2">Charla no encontrada</h1>
        <p className="text-secondary">No existe una charla con el identificador indicado.</p>
        <Link className="btn btn-outline-primary" to="/charlas">Volver a charlas</Link>
      </section>
    );
  }

  return (
    <article className="card shadow-sm">
      <div className="card-body p-4">
        <p className="text-secondary small">Charla de orientación · Agenda de ejemplo</p>
        <h1 className="h2">{charla.nombre}</h1>
        <dl className="mt-4">
          <dt>Tema</dt>
          <dd>{charla.tema}</dd>
          <dt>Fecha</dt>
          <dd><time dateTime={charla.fecha}>{formatearFecha(charla.fecha)}</time></dd>
          <dt>Horario</dt>
          <dd>{charla.horario} h</dd>
          <dt>Sede</dt>
          <dd>{charla.sede.nombre}</dd>
          <dt>Dirección</dt>
          <dd>{charla.sede.direccion}</dd>
        </dl>
        <section className="my-4" aria-labelledby="titulo-ubicacion">
          <h2 id="titulo-ubicacion" className="h5">Ubicación de la sede</h2>
          {cargando ? (
            <p className="text-secondary" role="status">Buscando la ubicación de la sede…</p>
          ) : consulta.error ? (
            <p className="alert alert-warning" role="alert">
              El mapa no está disponible. {consulta.error}
            </p>
          ) : (
            <MapaSede ubicacion={consulta.ubicacion} nombreSede={charla.sede.nombre} />
          )}
        </section>
        <Link className="btn btn-outline-primary" to="/charlas">Volver a charlas</Link>
      </div>
    </article>
  );
}
