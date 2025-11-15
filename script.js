// Initialize the map centered on the network
const map = L.map('map').setView([51.9607, 7.6361], 8);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Load GeoJSON from file
fetch('train_stations.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        // Custom train station icon
        const trainIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0iI2QzMmYyZiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNkMzJmMmYiLz48L3N2Zz4=',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });

        // Line colors mapping
        const lineColors = {
            'L1': '#d32f2f',
            'L2': '#1976d2',
            'L3': '#388e3c'
        };

        // Add GeoJSON layer to map
        L.geoJSON(geojsonData, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: trainIcon });
            },
            onEachFeature: function (feature, layer) {
                if (feature.geometry.type === 'Point') {
                    // Create popup content for stations
                    let popupContent = `
                        <div class="station-popup">
                            <h3>${feature.properties.name}</h3>
                            <p><strong>City:</strong> ${feature.properties.city}</p>
                            <p><strong>Station ID:</strong> ${feature.id}</p>
                            <p><strong>Train Lines:</strong></p>
                    `;
                    
                    feature.properties.trainLines.forEach(line => {
                        popupContent += `
                            <div class="train-line">
                                <strong>${line.id}:</strong> ${line.from} → ${line.to}
                            </div>
                        `;
                    });
                    
                    popupContent += `</div>`;
                    layer.bindPopup(popupContent);
                } else if (feature.geometry.type === 'LineString') {
                    // Create popup content for train lines
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
            style: function(feature) {
                if (feature.geometry.type === 'LineString') {
                    const lineId = feature.properties.line_id;
                    return {
                        color: lineColors[lineId] || '#666',
                        weight: 4,
                        opacity: 0.7
                    };
                }
            }
        }).addTo(map);

        // Fit map to show all features
        const bounds = L.geoJSON(geojsonData).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
        alert('Error loading train_stations.geojson file. Make sure it is in the same folder as this HTML file.');
    });