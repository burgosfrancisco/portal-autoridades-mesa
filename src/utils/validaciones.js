import { charlas } from '../data/charlas.js';
import { distritosElectorales } from '../data/distritos.js';

export function crearFormularioVacio() {
  return {
    distritoElectoral: '',
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    domicilio: '',
    telefono: '',
    correoElectronico: '',
    fueAutoridadMesa: '',
    cumplioCapacitaciones: '',
    afiliado: '',
    agrupacionPolitica: '',
    charlasInteres: [],
  };
}

export function normalizarDni(dni) {
  return String(dni ?? '').replace(/[.\s]/g, '').replace(/^0+(?=\d)/, '');
}

function tieneTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function esCorreoValido(valor) {
  if (!tieneTexto(valor)) return false;

  const correo = valor.trim();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[^\s@]+$/i.test(correo)) return false;

  const [usuario, dominio] = correo.split('@');
  if (usuario.startsWith('.') || usuario.endsWith('.') || usuario.includes('..')) return false;

  const segmentos = dominio.split('.');
  return segmentos.length >= 2
    && segmentos.every((segmento) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(segmento));
}

function esTelefonoValido(valor) {
  return tieneTexto(valor) && /^[\d +()-]+$/.test(valor.trim()) && /\d/.test(valor);
}

function esFechaNacimientoValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;

  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(`${valor}T00:00:00`);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return anio > 0
    && fecha.getFullYear() === anio
    && fecha.getMonth() + 1 === mes
    && fecha.getDate() === dia
    && fecha <= hoy;
}

export function validarInscripcion(formulario) {
  const errores = {};

  if (!distritosElectorales.includes(formulario.distritoElectoral)) {
    errores.distritoElectoral = 'Seleccioná un distrito electoral de la lista.';
  }
  if (!tieneTexto(formulario.nombre)) errores.nombre = 'Ingresá tu nombre.';
  if (!tieneTexto(formulario.apellido)) errores.apellido = 'Ingresá tu apellido.';
  if (!/^\d{6,8}$/.test(normalizarDni(formulario.dni))) {
    errores.dni = 'Ingresá un DNI de 6 a 8 dígitos. Podés usar puntos o espacios.';
  }
  if (!esFechaNacimientoValida(formulario.fechaNacimiento)) {
    errores.fechaNacimiento = 'Ingresá una fecha de nacimiento válida, que no sea futura.';
  }
  if (!tieneTexto(formulario.domicilio)) errores.domicilio = 'Ingresá tu domicilio actual.';
  if (!esTelefonoValido(formulario.telefono)) {
    errores.telefono = 'Ingresá un teléfono con números. Podés usar espacios, +, - y paréntesis.';
  }
  if (!esCorreoValido(formulario.correoElectronico)) {
    errores.correoElectronico = 'Ingresá un correo electrónico válido, por ejemplo nombre@correo.com.';
  }

  for (const campo of ['fueAutoridadMesa', 'cumplioCapacitaciones', 'afiliado']) {
    if (!['si', 'no'].includes(formulario[campo])) {
      errores[campo] = 'Seleccioná Sí o No.';
    }
  }
  if (formulario.afiliado === 'si' && !tieneTexto(formulario.agrupacionPolitica)) {
    errores.agrupacionPolitica = 'Ingresá el nombre de la agrupación política.';
  }
  if (!Array.isArray(formulario.charlasInteres)
    || formulario.charlasInteres.some((id) => !charlas.some((charla) => charla.id === id))
    || new Set(formulario.charlasInteres).size !== formulario.charlasInteres.length) {
    errores.charlasInteres = 'Seleccioná únicamente charlas disponibles, sin repetirlas.';
  }

  return errores;
}
