// Initialize the interface

function init(){
  // Query the URL for parameters
  var query = QueryString();
  if(query){jQuery("#interface").append("<h4>" + "Byggesag: " + query.ID + "</h4>");}

  // Start loading geometry and attributes from MSSQL server with ID

  // placeholder loader
  function spin(){
    jQuery("body").append("<div class='spinner'></div>");
    setTimeout(endLoad, 3000);
    function endLoad(){
      jQuery(".spinner").remove();
    }
  }
  spin();

  // create the map
  map = L.map('map', {
    center: [55.783014, 12.519372],
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



}
