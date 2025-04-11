// state variables for latitude and longitude
let latitude = 46.4768;
let longitude = 30.7391;

var esri_url ='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esri_attribution = '© Esri © OpenStreetMap Contributors';

var lyr_satellite = L.tileLayer(esri_url, {id: 'MapID', maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: esri_attribution});

var map = L.map('map', {
    center: [latitude, longitude],
    zoom: 13,
    layers: [lyr_satellite]
});

var baseMaps = {
    "Satellite": lyr_satellite
};


// when the coordinates change somehow, propagate that change everywhere
async function updateCoords(lat, lng) {
    // make sure longitude is in the range (-180, 180]
    while (lng <= -180) {
        lng += 360;
    }
    while (lng > 180) {
        lng -= 360;
    }
    
    // store the new coordinates in state variables
    latitude = lat;
    longitude = lng;
    
    // move the map to focus on this
    let currentMapZoom = map.getZoom();
    let newMapZoom = Math.max(currentMapZoom, 4);
    map.setView([latitude, longitude], newMapZoom);
}


// or enter coords by clicking on map
async function onMapClick(e) {
    updateCoords(e.latlng.lat, e.latlng.lng);
}

map.on('click', onMapClick);
