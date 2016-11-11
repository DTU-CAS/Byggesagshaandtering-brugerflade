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

  // Start loading geometry and attributes from MSSQL server with ID

  popUpTable(json1);

  // Query the URL for parameters
  var query = QueryString();
  if(query){jQuery("#interface").prepend("<h4>" + "Byggesag: " + query.ID + "</h4>");}

    // define toolbar options
  var options = {
      position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
      drawMarker: true,  // adds button to draw markers
      drawPolygon: true,  // adds button to draw a polygon
      drawPolyline: true,  // adds button to draw a polyline
      editPolygon: true,  // adds button to toggle global edit mode
      deleteLayer: true   // adds a button to delete layers
  };

  // Marker is special Casper

  // add leaflet.pm controls to the map
  map.pm.addControls(options);
  map.on('pm:create', function(e) {
    var feature = e.layer;
    bob = feature;
    e.layer.properties = {
      "car": "toyota",
      "cycle": false
    };

    feature.on('click', function(e){
      var latLng = e.latlng;

      L.popup()
      .setLatLng(latLng)
      .setContent(infoPanel(feature.properties))
      .openOn(map);

      $('.table-remove').on('click', function(){
        $(this).parent().remove();
      });

      $('.table-add').on('click', function(){
        $(".table > tbody").append(addRow("unNames", "editMe", "string", "true", "true"));

        $('.table-remove').on('click', function(){
          $(this).parent().remove();
        });

      });
    })

    .on('mouseover', function(e){
     feature.setStyle({color: "#28edca"});
    })
    .on('mouseout', function(e){
     feature.setStyle({color: "#21bde7"});
    });

    console.log(e.layer);});

}
