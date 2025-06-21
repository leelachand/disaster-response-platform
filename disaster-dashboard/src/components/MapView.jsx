import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = () => {
  const [geoData, setGeoData] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/disasters/geojson');
        const features = res.data.features;
        setGeoData(features);

        if (features.length > 0) {
          const [lng, lat] = features[0].geometry.coordinates;
          setMapCenter([lat, lng]);
        }
      } catch (err) {
        console.error('Failed to load GeoJSON data:', err);
      }
    };

    loadGeoData();
  }, []);

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoData.map((feature) => (
        <Marker
          key={feature.properties.id}
          position={[
            feature.geometry.coordinates[1], // lat
            feature.geometry.coordinates[0], // lng
          ]}
        >
          <Popup>
            <strong>{feature.properties.title}</strong><br />
            {feature.properties.location_name}<br />
            {feature.properties.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
