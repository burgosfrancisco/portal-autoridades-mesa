import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Charlas from './pages/Charlas.jsx';
import DetalleCharla from './pages/DetalleCharla.jsx';
import Inscripcion from './pages/Inscripcion.jsx';

export default function App() {
  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/charlas" element={<Charlas />} />
          <Route path="/charlas/:id" element={<DetalleCharla />} />
          <Route path="/inscripcion" element={<Inscripcion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
