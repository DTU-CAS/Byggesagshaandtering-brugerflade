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

  var overlayMaps = {
    // ...
  };

  var mainControl = L.control.layers(basemaps, overlayMaps, {collapsed: false}).addTo(map);

  var layers2add_WMS = [
    ['6832 ', 'Byggepladser'],
    ['6834 ', 'Parkering'],
    ['6831 ', 'Adgangsveje'],
    ['6833 ', 'Ombyg og Renovering'],
    ['7418', 'Nybyg'],
    ['18454', 'Streetfood'],
  ];

  for(var i = 0; i < layers2add_WMS.length; i++){
    var baseParam = L.tileLayer.wms("http://services.nirasmap.niras.dk/kortinfo/services/Wms.ashx?", {
      site: 'Provider',
      page: 'DTU',
      UserName: 'DTUView',
      Password: 'Bruger12',
      version: '1.1.1',
      layers: layers2add_WMS[i][0],
      format: 'image/png',
      maxZoom: 21,
      maxNativeZoom: 18,
      attribution: '&copy; <a href="http://DTU.dk">Danish Technical University</a>'
    });

    mainControl.addOverlay(baseParam, layers2add_WMS[i][1]);
  }

  var layers2add_WFS = [
    ['ugis:T6832', 'Byggepladser'],
    ['ugis:T6834', 'Parkering'],
    ['ugis:T6831', 'Adgangsveje'],
    ['ugis:T6833', 'Ombyg og Renovering'],
    ['ugis:T7418', 'Nybyg'],
    ['ugis:T18454', 'Streetfood'],
  ];

  // for(var j = 0; j < layers2add_WFS.length; j++){
    wfsBase = "http://services.nirasmap.niras.dk/kortinfo/services/Wfs.ashx?";
    wfsParams = {
      Site: 'Provider',
      Page: 'DTU',
      UserName: 'DTUView',
      Password: 'Bruger12',
      Service: 'WFS',
      Request: 'GetFeature',
      Typename: 'ugis:T6834',
      Srsname: 'EPSG:3857',
    };
    wfsRequest = wfsBase + L.Util.getParamString(wfsParams, wfsBase, true);

    $.ajax({url: wfsRequest, success: function(result){
      popUpTable(GML2GeoJSON(result, true));
    }});
  // }


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
