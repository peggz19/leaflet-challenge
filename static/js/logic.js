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
            layer.bindPopup(`<h2>Earthquake Details</h2> <hr> <h3> magnitude: ${feature.properties.mag}  <br> depth level: ${feature.geometry.coordinates[2]}<br> place: ${feature.properties.place}  <br> time: ${Date(feature.properties.time)} <br> depth level: ${feature.geometry.coordinates[2]}</h3>`);
            
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

  // Adding a legend
  // The below was done through ChatGPT
let legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth Levels</h4>";
    div.innerHTML += '<i style="background: lightgreen"></i> -10 to 10<br>';
    div.innerHTML += '<i style="background: yellow"></i> 10 to 30<br>';
    div.innerHTML += '<i style="background: coral"></i> 30 to 50<br>';
    div.innerHTML += '<i style="background: orange"></i> 50 to 70<br>';
    div.innerHTML += '<i style="background: darkorange"></i> 70 to 90<br>';
    div.innerHTML += '<i style="background: red"></i> > 90';
    return div;
};

legend.addTo(myMap);
})

let css = '.legend i { width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7; }';
css += '.legend { background: white; padding: 10px; border-radius: 5px; line-height: 18px; }';
document.getElementsByTagName('head')[0].innerHTML += '<style>' + css + '</style>';
// End of the ChatGPT code