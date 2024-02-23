// We create a function that changes the colors based on the earth depth
function chooseColor(depth) {
    if (depth >= -10 && depth < 10) return "lightgreen";
    else if (depth >= 10 && depth < 30) return "yellow";
    else if (depth >= 30 && depth < 50) return "coral";
    else if (depth >= 50 && depth < 70) return "orange";
    else if (depth >= 70 && depth < 90) return "darkorange";
    else return "red"
}


// storing our GeoJSON data in a variable
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

//Creating the maps
d3.json(url).then(function (data) {
    console.log(data)
  
    // pluging each data in a variable that will be used for ou markers
    let earthquakes = L.geoJSON(data,{
        pointToLayer :function (feature,latlng) {
            let mapStyle = {        
                radius: feature.properties.mag*2.5,
                color : "black",
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                weight: 1.5
            }

            return L.circleMarker(latlng,mapStyle)
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h2>Earthquake Details</h2> <hr> <h3> magnitude: ${feature.properties.mag} <br> place: ${feature.properties.place}  <br> time: ${Date(feature.properties.time)}</h3>`);
            
        }


    })

    //CREATING OUR BASE MAPS LAYERS
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

 //Building the BASE MAPS
  let baseMaps = {
    "Street Map": street,
  };
//Creting OVERLAY MAPS (NEW LAYERS)
  let overlayMaps = {
    "Earthquakes" : earthquakes
  }

//Building THE MAP. The coordinates are the ones for San Diego, CA
  let myMap = L.map("map", {
    center: [32.715736, -117.161087],
    zoom: 5,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
})

// Adding a legend
let legend = L.control({ position: "bottomright" });