🚆 Train Network Mapping – GeoJSON + Leaflet

An interactive map visualization of a simplified train network in North Rhine–Westphalia (Germany), built using Leaflet.js, GeoJSON, and custom dataset modeling.
This project demonstrates how to encode spatial data (stations + railway lines) using GeoJSON and how to render them on a web map.

📌 Features
🗺️ Interactive Leaflet Map

Displays train stations as custom red circular icons.

Renders multiple rail lines using different colors.

Pop-up windows show detailed information for each station and train line.

Map auto-fits to the extent of all features.

🚉 Train Stations (Points)

Defined as GeoJSON Feature objects with:

Station ID

Name

City

Train lines that stop there

Coordinates (Point geometry)

🚆 Train Lines (LineString)

Includes realistic simplified paths for:

RE01 – Düsseldorf Flughafen → Essen Hbf

RE02 – Düsseldorf Flughafen → Münster (Westf) Hbf

RE05 – Düsseldorf Flughafen → Bonn Hbf

Each line is a GeoJSON LineString with:

Start / end station

Intermediate major hubs

Distance

Color-coded paths

🎨 Legend

A dynamic legend displays the color and name of each train line.

📁 Project Structure
project/
│── 1_train_stations_Hector.xml               # Initial XML with station data
│── 2_train_network_schema_Hector.xsd         # XML Schema defining the train network structure
│── 3_train_network_gml_schema_Hector.xsd     # GML 3.2.1 application schema (extends the XML schema)
│── 3_train_stations_gml_Hector.xml           # Train stations encoded following the GML schema
│── 4_train_stations_Hector.json              # JSON version of the station dataset
│── 5_train_stations_Hector.geojson           # GeoJSON (stations + lines combined)
│── train_network_schema.xsd                  # Alternative XML Schema defining the train network structure
│── train_network_gml_schema.xsd              # Alternative GML 3.2.1 application schema (extends the XML schema)
│── train_stations_gml.xml                    # Alternative Train stations encoded following the GML schema
│── train_stations.json                       # Alternative JSON version of the station dataset
│── train_stations.geojson                    # Alternative GeoJSON used for the map

│── index.html                                # Main webpage containing the Leaflet map
│── script.js                                 # JavaScript logic: map initialization, icons, popups, loading GeoJSON
│── style.css                                 # Styling for the map, layout, and legend

└── README.md                                  # Documentation for the project


💾 Data Model
🧭 GeoJSON Standard

This project follows the RFC 7946 GeoJSON standard, using:

FeatureCollection

Feature

Point geometries

LineString geometries

Custom properties for metadata


🗺️ How to Run the Project
✔ Option 1: Open Locally

Just open index.html in any browser.

If you load GeoJSON using fetch(), you may need to run a simple local server:

python3 -m http.server


Then open:

http://localhost:8000

✔ Option 2: Deploy on GitHub Pages

Push the repository to GitHub

Go to Settings → Pages

Select main branch → / (root)

Your map will be live at:

https://yourusername.github.io/your-repo/

🧩 Technologies Used

Leaflet.js (interactive map)

OpenStreetMap tiles

GeoJSON (data modeling)

JavaScript (map logic)

HTML + CSS

Optional: VS Code Live Server or Python http.server

📚 Learning Objectives

This project is particularly useful for:

Understanding spatial data encoding (GeoJSON)

Creating custom web maps with Leaflet

Differentiating between Point and LineString geometries

Building interactive geospatial visualizations

Structuring a data-driven web mapping project
