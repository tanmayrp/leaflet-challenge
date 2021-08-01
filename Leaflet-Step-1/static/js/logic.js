//HELPER FUNCTIONS
function setMarkerSize(magnitude) {
    return magnitude * 3;
};

function setColor(depth) {
    if (depth > 90) {
        return '#FF0000';
    }
    else if (depth > 70 && depth <= 90) {
        return '#FF4500';
    }
    else if (depth > 50 && depth <= 70) {
        return '#FFA500';
    }
    else if (depth > 30 && depth <= 50) {
        return '#FFD700';
    }
    else if (depth > 10 && depth <= 30) {
        return '#7CFC00';
    }
    else {
        return '#32CD32';
    }
};
//END HELPER FUNCTIONS

var earthquake = new L.LayerGroup();

function createMap() {
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
      });
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      });

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
      });


    var baseLayers = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors,
          
    };

    var overlays = {
        "Earthquakes": earthquake,
        
    };

    var mymap = L.map('map', {
        center: [40.05713, -100.27728],
        zoom: 4,
        layers: [satellite, earthquake]
    });

    L.control.layers(baseLayers, overlays,{collapsed:false}).addTo(mymap);
 
    var legend = L.control({ 
        position: 'bottomright' 
    });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #32CD32"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #7CFC00"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #FFD700"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #FFA500"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #FF4500"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #FF0000"></i><span>90+</span><br>';

        return div;
    };
    legend.addTo(mymap);

}

function StartMapping() {
    
    // URL to retrieve data
    var url_past7Days_AllEarthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    d3.json(url_past7Days_AllEarthquakes).then(function(geoJson) {
        L.geoJSON(geoJson.features, {
            pointToLayer: function (geoJsonPoint, latlng) {
                return L.circleMarker(latlng, { radius: setMarkerSize(geoJsonPoint.properties.mag) });
            },
            style: function (geoJsonFeature) {
                return {
                    fillColor: setColor(geoJsonFeature.geometry.coordinates[2]),//depth
                    fillOpacity: 0.7,
                    weight: 0.1,
                    color: 'black'
                }
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    "<h4 style='text-align:center;'>Magnitude: " + feature.properties.mag + "</h4>" +
                    "<hr><h4 style='text-align:center;'>Lat: " + feature.geometry.coordinates[0] + "</h4>" +
                    "<hr><h4 style='text-align:center;'>Long: " + feature.geometry.coordinates[1] + "</h4>" +
                    "<hr><h4 style='text-align:center;'>Depth: " + feature.geometry.coordinates[2] + "</h4>");
            }
        }).addTo(earthquake);
        createMap(earthquake);
    });
}
StartMapping();