import { useEffect, useRef, useState } from 'react';
import CampoFormulario from '../components/CampoFormulario.jsx';
import PreguntaSiNo from '../components/PreguntaSiNo.jsx';
import { charlas } from '../data/charlas.js';
import { distritosElectorales } from '../data/distritos.js';
import { guardarSolicitud } from '../storage/solicitudesStorage.js';
import { crearFormularioVacio, validarInscripcion } from '../utils/validaciones.js';
import { formatearFecha } from '../utils/formatearFecha.js';

const camposPersonales = [
  { nombre: 'nombre', etiqueta: 'Nombre', autoComplete: 'given-name' },
  { nombre: 'apellido', etiqueta: 'Apellido', autoComplete: 'family-name' },
  { nombre: 'dni', etiqueta: 'DNI', inputMode: 'numeric', ayuda: 'Entre 6 y 8 dígitos. Podés usar puntos.' },
  { nombre: 'fechaNacimiento', etiqueta: 'Fecha de nacimiento', tipo: 'date', autoComplete: 'bday' },
  { nombre: 'domicilio', etiqueta: 'Domicilio actual', autoComplete: 'street-address' },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel', autoComplete: 'tel' },
  { nombre: 'correoElectronico', etiqueta: 'Correo electrónico', tipo: 'email', autoComplete: 'email' },
];

export default function Inscripcion() {
  const [formulario, setFormulario] = useState(crearFormularioVacio);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);
  const formularioRef = useRef(null);
  const confirmacionRef = useRef(null);
  const errorGeneralRef = useRef(null);

  useEffect(() => {
    if (confirmacion) confirmacionRef.current?.focus();
  }, [confirmacion]);

  useEffect(() => {
    if (errorGeneral) {
      errorGeneralRef.current?.focus();
      errorGeneralRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }, [errorGeneral]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
      ...(name === 'afiliado' && value === 'no' ? { agrupacionPolitica: '' } : {}),
    }));
    setErrores((anteriores) => {
      const siguientes = { ...anteriores };
      delete siguientes[name];
      if (name === 'afiliado' && value === 'no') delete siguientes.agrupacionPolitica;
      return siguientes;
    });
    setErrorGeneral('');
    setConfirmacion(null);
  }

  function cambiarCharla(evento) {
    const { value, checked } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      charlasInteres: checked
        ? [...anterior.charlasInteres, value]
        : anterior.charlasInteres.filter((id) => id !== value),
    }));
    setConfirmacion(null);
  }

  function mostrarErrores(nuevosErrores) {
    setErrores(nuevosErrores);
    const primerCampo = Object.keys(nuevosErrores)[0];
    formularioRef.current?.querySelector(`[name="${primerCampo}"]`)?.focus();
  }

  function enviarFormulario(evento) {
    evento.preventDefault();
    if (confirmacion) return;
    setConfirmacion(null);
    setErrorGeneral('');
    const nuevosErrores = validarInscripcion(formulario);

    if (Object.keys(nuevosErrores).length > 0) {
      mostrarErrores(nuevosErrores);
      return;
    }

    try {
      const solicitud = guardarSolicitud(formulario);
      setFormulario(crearFormularioVacio());
      setErrores({});
      setConfirmacion(solicitud);
    } catch (error) {
      if (error.campo) {
        mostrarErrores({ [error.campo]: error.message });
      } else {
        setErrorGeneral(error.message);
      }
    }
  }

  return (
    <section className="card shadow-sm">
      <div className="card-body p-3 p-md-4">
        <h1 className="h2">Inscripción como postulante</h1>
        <p className="text-secondary">
          Completá tus datos para la convocatoria actual. Todos los campos son obligatorios,
          excepto las charlas de interés. La agrupación política se solicita solamente si estás afiliado.
        </p>

        {confirmacion && (
          <div className="alert alert-success" role="status" tabIndex={-1} ref={confirmacionRef}>
            <h2 className="h5">Tu inscripción fue registrada correctamente</h2>
            <p className="mb-0">Estado de la solicitud: <strong>{confirmacion.estado}</strong>.</p>
          </div>
        )}
        {errorGeneral && (
          <p className="alert alert-danger" role="alert" tabIndex={-1} ref={errorGeneralRef}>
            {errorGeneral}
          </p>
        )}
        {Object.keys(errores).length > 0 && (
          <p className="alert alert-warning" role="alert">Revisá los campos indicados antes de enviar.</p>
        )}

        <form ref={formularioRef} onSubmit={enviarFormulario} noValidate>
          <fieldset className="mb-4">
            <legend className="h5">Distrito electoral</legend>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label" htmlFor="distritoElectoral">Distrito electoral</label>
                <select
                  id="distritoElectoral"
                  name="distritoElectoral"
                  className={`form-select${errores.distritoElectoral ? ' is-invalid' : ''}`}
                  value={formulario.distritoElectoral}
                  onChange={cambiarCampo}
                  required
                  aria-invalid={Boolean(errores.distritoElectoral)}
                  aria-describedby={errores.distritoElectoral ? 'distritoElectoral-error' : undefined}
                >
                  <option value="">Seleccioná un distrito</option>
                  {distritosElectorales.map((distrito) => (
                    <option key={distrito} value={distrito}>{distrito}</option>
                  ))}
                </select>
                {errores.distritoElectoral && (
                  <div className="invalid-feedback" id="distritoElectoral-error">{errores.distritoElectoral}</div>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="border-top pt-4 mb-4">
            <legend className="h5">Datos personales y de contacto</legend>
            <div className="row g-3">
              {camposPersonales.map((campo) => (
                <div className="col-md-6" key={campo.nombre}>
                  <CampoFormulario
                    {...campo}
                    valor={formulario[campo.nombre]}
                    alCambiar={cambiarCampo}
                    error={errores[campo.nombre]}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-top pt-4 mb-4">
            <legend className="h5">Antecedentes</legend>
            <div className="row g-3">
              <div className="col-md-6">
                <PreguntaSiNo nombre="fueAutoridadMesa" pregunta="¿Fuiste autoridad de mesa anteriormente?"
                  valor={formulario.fueAutoridadMesa} alCambiar={cambiarCampo} error={errores.fueAutoridadMesa} />
              </div>
              <div className="col-md-6">
                <PreguntaSiNo nombre="cumplioCapacitaciones" pregunta="¿Cumpliste con las capacitaciones?"
                  valor={formulario.cumplioCapacitaciones} alCambiar={cambiarCampo} error={errores.cumplioCapacitaciones} />
              </div>
            </div>
          </fieldset>

          <fieldset className="border-top pt-4 mb-4">
            <legend className="h5">Afiliación política</legend>
            <PreguntaSiNo nombre="afiliado" pregunta="¿Estás afiliado a una agrupación política?"
              valor={formulario.afiliado} alCambiar={cambiarCampo} error={errores.afiliado} />
            {formulario.afiliado === 'si' && (
              <div className="row mt-3">
                <div className="col-md-6">
                  <CampoFormulario nombre="agrupacionPolitica" etiqueta="Agrupación política"
                    valor={formulario.agrupacionPolitica} alCambiar={cambiarCampo} error={errores.agrupacionPolitica} />
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="border-top pt-4 mb-4" aria-describedby="charlas-ayuda">
            <legend className="h5">Charlas de interés (opcional)</legend>
            <p className="text-secondary" id="charlas-ayuda">Podés elegir ninguna, una o varias charlas.</p>
            {charlas.map((charla) => (
              <div className="form-check mb-2" key={charla.id}>
                <input className="form-check-input" type="checkbox" name="charlasInteres"
                  id={`charla-${charla.id}`} value={charla.id}
                  checked={formulario.charlasInteres.includes(charla.id)} onChange={cambiarCharla}
                  aria-invalid={Boolean(errores.charlasInteres)}
                  aria-describedby={errores.charlasInteres ? 'charlasInteres-error' : undefined} />
                <label className="form-check-label" htmlFor={`charla-${charla.id}`}>
                  {charla.nombre}
                  <span className="d-block small text-secondary">{formatearFecha(charla.fecha)} · {charla.horario} h · {charla.sede.nombre}</span>
                </label>
              </div>
            ))}
            {errores.charlasInteres && <div className="invalid-feedback d-block" id="charlasInteres-error">{errores.charlasInteres}</div>}
          </fieldset>

          <p className="small text-secondary">La inscripción queda guardada en este navegador y en este dispositivo.</p>
          <button className="btn btn-primary" type="submit" disabled={Boolean(confirmacion)}>Registrar inscripción</button>
        </form>
      </div>
    </section>
  );
}
