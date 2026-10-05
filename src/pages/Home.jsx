import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h1 className="h2">Portal para Autoridades de Mesa</h1>
        <p className="text-secondary">
          Bienvenido al portal. Podés consultar las charlas de orientación.
          La inscripción como postulante estará disponible próximamente.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/charlas">Charlas</Link>
          <Link className="btn btn-outline-primary" to="/inscripcion">Inscripción</Link>
        </div>
      </div>
    </section>
  );
}
