import { Icon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Importar las imágenes permite que Vite resuelva sus rutas también al compilar.
const iconoSede = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapaSede({ ubicacion, nombreSede }) {
  const posicion = [ubicacion.latitud, ubicacion.longitud];

  return (
    <div role="region" aria-label={`Mapa de ${nombreSede}`}>
      <MapContainer
        key={posicion.join(',')}
        center={posicion}
        zoom={16}
        scrollWheelZoom={false}
        className="rounded border"
        style={{ height: '380px', width: '100%' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={posicion} icon={iconoSede} title={nombreSede} alt={nombreSede}>
          <Popup>{nombreSede}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
