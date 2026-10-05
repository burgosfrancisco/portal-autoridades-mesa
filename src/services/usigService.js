const USIG_URL = 'https://servicios.usig.buenosaires.gob.ar/normalizar/';

function convertirCoordenada(valor, limite) {
  if (
    (typeof valor !== 'string' && typeof valor !== 'number') ||
    String(valor).trim() === ''
  ) {
    return null;
  }

  const numero = Number(valor);
  return Number.isFinite(numero) && Math.abs(numero) <= limite ? numero : null;
}

export async function obtenerUbicacion(direccion, { signal } = {}) {
  if (typeof direccion !== 'string' || !direccion.trim()) {
    throw new Error('La sede no tiene una dirección válida.');
  }

  const url = new URL(USIG_URL);
  url.search = new URLSearchParams({
    direccion: direccion.trim(),
    geocodificar: 'TRUE',
    srid: '4326',
    // Dos opciones permiten detectar una dirección ambigua.
    maxOptions: '2',
  }).toString();

  const limiteDeTiempo = AbortSignal.timeout(15000);
  const signalConsulta = signal
    ? AbortSignal.any([signal, limiteDeTiempo])
    : limiteDeTiempo;

  let datos;
  try {
    const respuesta = await fetch(url, { signal: signalConsulta });
    if (!respuesta.ok) {
      throw new Error('El servicio de ubicación no está disponible en este momento.');
    }
    datos = await respuesta.json();
  } catch (error) {
    if (signal?.aborted) throw error;
    if (signalConsulta.aborted) {
      throw new Error('El servicio de ubicación tardó demasiado en responder.');
    }
    if (error instanceof SyntaxError) {
      throw new Error('El servicio de ubicación devolvió una respuesta inválida.');
    }
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el servicio de ubicación. Revisá tu conexión.');
    }
    throw error;
  }

  if (!Array.isArray(datos?.direccionesNormalizadas)) {
    throw new Error('El servicio de ubicación devolvió una respuesta inválida.');
  }
  if (datos.direccionesNormalizadas.length === 0) {
    throw new Error('No se encontró la dirección de esta sede.');
  }
  if (datos.direccionesNormalizadas.length > 1) {
    throw new Error('La dirección de la sede coincide con más de una ubicación.');
  }

  const coordenadas = datos.direccionesNormalizadas[0]?.coordenadas;
  // USIG entrega x = longitud e y = latitud en el sistema solicitado (WGS84).
  const longitud = convertirCoordenada(coordenadas?.x, 180);
  const latitud = convertirCoordenada(coordenadas?.y, 90);
  const sistemaValido = coordenadas?.srid === 4326 || coordenadas?.srid === '4326';

  if (!sistemaValido || longitud === null || latitud === null) {
    throw new Error('El servicio de ubicación no devolvió coordenadas válidas para esta sede.');
  }

  return { latitud, longitud };
}
