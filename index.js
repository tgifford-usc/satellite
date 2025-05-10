// state variables for latitude and longitude
let latitude = 46.4768;
let longitude = 30.7391;
let aspectRatio = 9 / 16;

const layer_satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri © OpenStreetMap Contributors',
    id: 'MapID', 
    maxZoom: 20, 
    tileSize: 512, 
    zoomOffset: -1, 
});

const map = L.map('map', {
    center: [latitude, longitude],
    zoom: 13,
    layers: [layer_satellite]
});


const layer_roads = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri',
    maxZoom: 20
}).addTo(map);
  
const layer_labels = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri',
    maxZoom: 20
}).addTo(map);
 

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


const poi = [
    [46.368591420397856, 30.725943268124652],
    [46.413639637781955, 30.72509083929136],
    [46.38394556346204, 30.749418743332836],
    [46.56396430861289, 30.836155494582947],
    [46.46085483538552, 30.75109534854745],
    [46.460254411308284, 30.749712615923364],
    [46.459788250336054, 30.749719452248932],
    [46.48532007145473, 30.74444526581465],
    [46.48501683554047, 30.74473462483897],
    [46.48336255880653, 30.73129710369442],
    [46.488055904883716, 30.736295927525354],
    [46.486772086232484, 30.72750448278927],
    [46.49109185402058, 30.7465874293984],
    [46.493473338516765, 30.728845646022588],
    [46.473434948329555, 30.711918896279848],
    [46.593168088481924, 30.80264380157496],
    [46.41708538039061, 30.76278342696602],
    [46.481345675669104, 30.743576638091017],
    [46.48082852884869, 30.74369465527158]
];

const lats = poi.map(p => p[0]);
const lngs = poi.map(p => p[1]);

const bounds = L.latLngBounds(
  L.latLng(Math.min(...lats), Math.min(...lngs)),
  L.latLng(Math.max(...lats), Math.max(...lngs))
);

// Pad bounding box by 5%
const padLat = bounds.getNorth() - bounds.getSouth();
const padLng = bounds.getEast() - bounds.getWest();

const paddedBounds = L.latLngBounds(
    [bounds.getSouth() - padLat * 0.05, bounds.getWest() - padLng * 0.05],
    [bounds.getNorth() + padLat * 0.05, bounds.getEast() + padLng * 0.05]
  );


let markers = poi.map((x) => { return L.marker(x).addTo(map)} );

map.fitBounds(paddedBounds);

const boundingBox = L.rectangle(paddedBounds, {color: "#ff7800", weight: 1}).addTo(map);
