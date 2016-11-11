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
  if(query){jQuery("#input").append("<p class='idTag'>" + "Byggesag: " + query.ID + "</p>");}

  map.on('pm:create', function(e) {
    var feature = e.layer;
    feature.setStyle({color: "#21bde7"});
    e.layer.properties = {
      "editMe": true
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

  });
}
