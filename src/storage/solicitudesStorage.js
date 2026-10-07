import { normalizarDni, validarInscripcion } from '../utils/validaciones.js';

// Todas las solicitudes de este prototipo pertenecen a la única convocatoria actual.
const CLAVE_SOLICITUDES = 'portal-autoridades-mesa:solicitudes:convocatoria-actual';

export function obtenerSolicitudes() {
  let contenido;
  try {
    contenido = localStorage.getItem(CLAVE_SOLICITUDES);
  } catch {
    throw new Error('No se puede acceder al almacenamiento del navegador. Habilitalo para registrar la inscripción.');
  }
  if (contenido === null) return [];

  let solicitudes;
  try {
    solicitudes = JSON.parse(contenido);
  } catch {
    throw new Error('Las solicitudes guardadas tienen un formato inválido. No se modificaron los datos existentes.');
  }
  if (!Array.isArray(solicitudes)
    || solicitudes.some((solicitud) => !solicitud
      || typeof solicitud.postulante?.dni !== 'string'
      || !/^\d{6,8}$/.test(normalizarDni(solicitud.postulante.dni)))) {
    throw new Error('Las solicitudes guardadas tienen un formato inválido. No se modificaron los datos existentes.');
  }
  return solicitudes;
}

function contieneDni(solicitudes, dni) {
  const dniNormalizado = normalizarDni(dni);
  return solicitudes.some((solicitud) => normalizarDni(solicitud.postulante.dni) === dniNormalizado);
}

export function existeSolicitudConDni(dni) {
  return contieneDni(obtenerSolicitudes(), dni);
}

export function guardarSolicitud(formulario) {
  const errores = validarInscripcion(formulario);
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo) {
    const error = new Error(errores[primerCampo]);
    error.campo = primerCampo;
    throw error;
  }

  const solicitudes = obtenerSolicitudes();
  if (contieneDni(solicitudes, formulario.dni)) {
    const error = new Error('Ya existe una inscripción con este DNI en la convocatoria actual.');
    error.campo = 'dni';
    throw error;
  }

  const afiliado = formulario.afiliado === 'si';
  const solicitud = {
    id: crypto.randomUUID(),
    fechaRegistro: new Date().toISOString(),
    estado: 'Pendiente',
    distritoElectoral: formulario.distritoElectoral,
    postulante: {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      dni: normalizarDni(formulario.dni),
      fechaNacimiento: formulario.fechaNacimiento,
      domicilio: formulario.domicilio.trim(),
      telefono: formulario.telefono.trim(),
      correoElectronico: formulario.correoElectronico.trim().toLowerCase(),
    },
    antecedentes: {
      fueAutoridadMesa: formulario.fueAutoridadMesa === 'si',
      cumplioCapacitaciones: formulario.cumplioCapacitaciones === 'si',
    },
    afiliacionPolitica: {
      afiliado,
      ...(afiliado ? { agrupacion: formulario.agrupacionPolitica.trim() } : {}),
    },
    charlasInteres: [...formulario.charlasInteres],
  };

  try {
    localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify([...solicitudes, solicitud]));
  } catch {
    throw new Error('No se pudo guardar la inscripción. Revisá el espacio disponible y los permisos de almacenamiento del navegador e intentá nuevamente.');
  }
  return solicitud;
}
