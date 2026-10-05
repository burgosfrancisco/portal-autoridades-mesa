// Conserva la fecha calendario sin convertirla entre zonas horarias.
export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}
