import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar bg-white border-bottom" aria-label="Navegación principal">
      <div className="container gap-3">
        <Link className="navbar-brand text-primary fw-semibold text-wrap" to="/">
          Autoridades de Mesa
        </Link>
        <ul className="nav nav-pills flex-wrap gap-1">
          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>Inicio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/charlas">Charlas</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/inscripcion">Inscripción</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
