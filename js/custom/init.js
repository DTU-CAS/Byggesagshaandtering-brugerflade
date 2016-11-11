// Initialize the interface

function init(){
  // create the map
  map = L.map('map', {
    center: [55.787016, 12.522536],
    zoom: 17,
    maxZoom: 21,
    minZoom: 14,
    zoomControl: false
  });

  // GST Ortho 2016
  var	GST_Ortho = L.tileLayer.wms('http://kortforsyningen.kms.dk/?servicename=orto_foraar', {
    login: 'qgisdk',
    password: 'qgisdk',
    version: '1.1.1',
    layers: 'orto_foraar',
    format: 'image/png',
    continuousWorld : true,
    maxZoom: 21,
    maxNativeZoom: 18,
    attribution: '&copy; <a href="http://gst.dk">GeoDanmark</a>'
  }).addTo(map);

  var OSMbasemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 21,
    maxNativeZoom: 18
  });

  // Add to layer control
  var basemaps = {
    "GST": GST_Ortho,
    "OSM": OSMbasemap
  };

  L.control.layers(basemaps, {}, {collapsed: false}).addTo(map);

  // editing options
   options = {
     draggable: true,
     snappable: true,
     snapDistance: 30,
     templineStyle: {
         color: 'red',
     },
     hintlineStyle: {
         color: 'red',
         dashArray: [5, 5],
     },
   };

  // Start loading geometry and attributes from MSSQL server with ID
  popUpTable(json1);

  // Query the URL for parameters
  query = QueryString();
  if(query){jQuery("#input").append("<p class='idTag'>" + "Byggesag: " + query.ID + "</p>");}


  interface();
}
