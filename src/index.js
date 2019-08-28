import './css/style.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-ajax/dist/leaflet.ajax.min.js';

var map = L.map('map').setView([35.5, 99.6], 4);
var baseMap1 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org/copyright", target="_blank">OpenStreetMap contributors</a>',
    opacity: 0.9,
});
baseMap1.addTo(map);

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.population) {
        layer.bindPopup("<table>" +
            "<tr><td>Province</td><td>" + feature.properties.name + "</td></tr>" +
            "<tr class='evenrowcol'><td>Population</td><td>" + feature.properties.population + "</td></tr>" +
            "</table>"
        );
    }
};

function getValue(x) {
    return x > 140000000 ? "#ED1B24" :
        x > 80000000 ? "#ED1B24" :
        x > 70000000 ? "#F68121" :
        x > 50000000 ? "#FFDE00" :
        x > 10000000 ? "#79C24D" :
        x > 0 ? "#88E9C2" :
        "#808080";
}

function style(feature) {
    return {
        "fillColor": getValue(feature.properties.population),
        "weight": 1,
        "color": 'black',
        "fillOpacity": 0.6
    };
}

var cnpop = new L.GeoJSON.AJAX("./data/map.geojson", {
    className: "cnpop",
    onEachFeature: onEachFeature,
    style: style
});
cnpop.addTo(map);

var legend = L.control({
    position: 'bottomright'
});
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend'),
        colors = ["#88E9C2", "#79C24D", "#FFDE00", "#F68121", "#ED1B24"],
        grades = ["0", "1M", "5M", "10M", "80M", "140M"];
    div.innerHTML += 'Population (2010)<br>'
    for (var i = 0; i < grades.length - 1; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + '&ndash;' + grades[i + 1] + '<br>';
    }
    return div;
};
legend.addTo(map);