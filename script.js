// Initialize the map centered on the network
const map = L.map('map').setView([51.9607, 7.6361], 8);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Icono de estación (lo dejamos igual que antes)
const trainIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iI2QzMmYyZiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNkMzJmMmYiLz48L3N2Zz4=',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

// Colores para las líneas
const lineColors = {
    'L1': '#d32f2f',
    'L2': '#1976d2',
    'L3': '#388e3c',
    'RE01': '#ff9800',   // Düsseldorf Flughafen - Essen Hbf
    'RE02': '#9c27b0',   // Düsseldorf Flughafen - Münster (Westf) Hbf
    'RE05': '#009688',   // Düsseldorf Flughafen - Bonn Hauptbahnhof
};

// Función que crea la capa GeoJSON (para reutilizarla)
function createTrainLayer(geojsonData) {
    return L.geoJSON(geojsonData, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: trainIcon });
        },
        onEachFeature: function (feature, layer) {
            if (feature.geometry.type === 'Point') {
                // Para soportar los dos archivos:
                const stationId = feature.id || feature.properties.id || 'N/A';

                let popupContent = `
                    <div class="station-popup">
                        <h3>${feature.properties.name}</h3>
                        <p><strong>City:</strong> ${feature.properties.city}</p>
                        <p><strong>Station ID:</strong> ${stationId}</p>
                        <p><strong>Train Lines:</strong></p>
                `;

                if (Array.isArray(feature.properties.trainLines)) {
                    feature.properties.trainLines.forEach(line => {
                        popupContent += `
                            <div class="train-line">
                                <strong>${line.id}:</strong> ${line.from} → ${line.to}
                            </div>
                        `;
                    });
                }

                popupContent += `</div>`;
                layer.bindPopup(popupContent);

            } else if (feature.geometry.type === 'LineString') {
                let popupContent = `
                    <div class="line-popup">
                        <h4>${feature.properties.name}</h4>
                        <p><strong>Route:</strong> ${feature.properties.from} → ${feature.properties.to}</p>
                `;
                if (feature.properties.via) {
                    popupContent += `<p><strong>Via:</strong> ${feature.properties.via}</p>`;
                }
                popupContent += `
                        <p><strong>Distance:</strong> ~${feature.properties.distance_km} km</p>
                    </div>
                `;
                layer.bindPopup(popupContent);
            }
        },
        style: function (feature) {
            if (feature.geometry.type === 'LineString') {
                const lineId = feature.properties.line_id;
                return {
                    color: lineColors[lineId] || '#666',
                    weight: 4,
                    opacity: 0.7
                };
            }
        }
    });
}

// Cargar los DOS GeoJSON y combinarlos
Promise.all([
    fetch('train_stations.geojson').then(r => r.json()),
    fetch('5_train_stations_Hector.geojson').then(r => r.json())
])
.then(([geo1, geo2]) => {
    const merged = {
        type: 'FeatureCollection',
        features: [
            ...geo1.features,
            ...geo2.features
        ]
    };

    const layer = createTrainLayer(merged).addTo(map);

    // Ajustar el mapa a todas las estaciones
    map.fitBounds(layer.getBounds(), { padding: [50, 50] });
})
.catch(error => {
    console.error('Error loading GeoJSON files:', error);
    alert('Error loading GeoJSON files. Check that both train_stations.geojson and 5_train_stations_Hector.geojson are in the same folder as this HTML file.');
});
