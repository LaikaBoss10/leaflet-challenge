// URL for API
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Fetch earthquake data from API
d3.json(url).then(function (data) {

    // Create map
    var earthquakemap = L.map("map").setView([37.00, -96.00], 4);
    // Add tile layer using the stamen toner style
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Map data &copy; <a href="https://www.arcgis.com/home/item.html?id=16f1b8ba0a61485ca8eddca6ba2b97b6">Esri</a>',
        maxZoom: 19
    }).addTo(earthquakemap);


    // Adds point specific data
    data.features.map(function(feature) {
    // store variables from json temporarily to make bubbles and add popup text
      let magnitude =      feature.properties.mag;
      let depth     =      feature.geometry.coordinates[2];
      let latitude  =      feature.geometry.coordinates[1];
      let longitude =      feature.geometry.coordinates[0];
    // make circle markers. magnitude*4.5 determines the bubble size
      L.circleMarker([latitude, longitude], {
        radius: magnitude*4.5,
        fillColor: getColor(depth),
        fillOpacity: 0.7,
        weight: 0.5
      })
    //   Add pop up that includes magnitude, depth,
      .bindPopup(`<h3>Magnitude: ${feature.properties.mag}, Depth: ${depth}km, Location: ${feature.properties.place}</h3>`)
      .addTo(earthquakemap);
    });


  // Create legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  let limits = [">10","10 to 30","30 to 50","50 to 70","70 to 90","90+"];
  let colors = ["rgb(44, 186, 0)","rgb(0, 255, 0)","rgb(163, 255, 0)","rgb(255, 244, 0)","rgb(255, 167, 0)","rgb(255, 0, 0)" ]
  let labels = ["<strong>Depth of<br>Earthquake</strong>"];

  limits.forEach(function (i, index) {
      labels.push(
          '<li style="background-color: ' +
              colors[index] +
              '">' +
              limits[index] +
              "</li>"
      );
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Add the legend to the map
legend.addTo(earthquakemap);
});





// Set color based on depth
function getColor(d) {
  if (d > 90) {return "rgb(255, 0, 0)" ;} // red
  else if (d > 70) {return "rgb(255, 167, 0)" ;} // red orange
  else if (d > 50) {return "rgb(255, 244, 0)" ;} //orange
  else if (d > 30) {return "rgb(163, 255, 0)" ;} //yellow green
  else if (d > 10) {return "rgb(0, 255, 0)" ;} // green
  else {return "rgb(44, 186, 0)" ;}// green
}
  
