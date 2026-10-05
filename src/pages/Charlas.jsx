import CharlaCard from '../components/CharlaCard.jsx';
import { charlas } from '../data/charlas.js';

export default function Charlas() {
  return (
    <section>
      <h1 className="h2">Charlas de orientación</h1>
      <p className="text-secondary mb-4">
        Consultá las charlas y seleccioná una para conocer su detalle. Agenda de ejemplo.
      </p>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {charlas.map((charla) => (
          <div className="col" key={charla.id}>
            <CharlaCard charla={charla} />
          </div>
        ))}
      </div>
    </section>
  );
}
