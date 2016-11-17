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
    attribution: '&copy; <a href="http://gst.dk">GeoDanmark</a>',
    edgeBufferTiles: 1
  });

  var OSMbasemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 21,
    maxNativeZoom: 18,
    edgeBufferTiles: 2
  }).addTo(map);

  // Add to layer control
  var basemaps = {
    "GST": GST_Ortho,
    "OSM": OSMbasemap
  };

  var overlayMaps = {
    // ...
  };

  var mainControl = L.control.layers(basemaps, overlayMaps, {collapsed: false}).addTo(map);

  var wmsLayers = [
    ["6832", "Byggepladser"],
    // ["6834", "Parkering"],
    // ["6831", "Adgangsveje"],
    // ["6833", "Ombyg og Renovering"],
    // ["7418", "Nybyg"],
    // ["7428", "Byggeri"],
    // ["18454", "Streetfood"],
  ];

  function addWMS(arr, getFeatureInfo){
    for (var k = 0; k < arr.length; k++){
      var layer = L.tileLayer.wms("http://services.nirasmap.niras.dk/kortinfo/services/Wms.ashx?", {
        site: 'Provider',
        page: 'DTU',
        userName: 'DTUView',
        password: 'Bruger12',
        loginType: "KortInfo",
        service: 'WMS',
        version: "1.1.1",
        layers: arr[k][0],
        transparent: true,
        format: 'image/png',
        maxZoom: 21,
        maxNativeZoom: 18,
        attribution: '&copy; <a href="http://DTU.dk">Danish Technical University</a>'
      });

      mainControl.addOverlay(layer, arr[k][1]);
    }

    if(getFeatureInfo === true){
      var layerString = "";
      for (var j = 0; j < arr.length; j++){
        layerString+= arr[j][0];
        if(j !== arr.length -1){
          layerString+= ",";
        }
      }

      // Modified from: Ryan Clark @ GitHub
      map.on('click', function(e){
        var latLng = e.latlng;
        var point = map.latLngToContainerPoint(latLng, map.getZoom());
        var size = map.getSize();

        // convert boundbox to srs
        var WGS84Param = proj4("EPSG:4326");
        var coordinateSystem = proj4(epsg["25832"]);
        var bbox = bounds2Arr(map.getBounds(), true);
        bbox[0] = proj4(WGS84Param, coordinateSystem, bbox[0]);
        bbox[1] = proj4(WGS84Param, coordinateSystem, bbox[1]);
        bbox = arr2bounds(bbox, true).toBBoxString();

        var params = {
          site: 'Provider',
          page: 'DTU',
          request: 'GetFeatureInfo',
          userName: 'DTUView',
          password: 'Bruger12',
          service: 'WMS',
          version: '1.1.1',
          layers: "6832",
          styles: "",
          srs: 'EPSG:25832',
          bbox: bbox,
          width: size.x,
          height: size.y,
          query_layers: "6832",
          x: point.x,
          y: point.y,
          type: 'nirasmap',
          feature_count: 1,
          info_format: 'text/xml'
        };

        content = layer._url + L.Util.getParamString(params, layer._url, true);

        $.ajax({url: content, success: function(result){
          fields = result.getElementsByTagName("field");

          if(fields.length > 0){
            var tableContent = "<table>";
            for(var i = 0; i < fields.length; i++){
              tableContent +=
              "<tr class='table-row'>" +
              "<td>" + $(fields[i]).attr("name") + "</td>" +
              "<td>" + fields[i].innerHTML + "</td>";
            }
            tableContent += "</table>";

            L.popup({ maxWidth: "600px"})
              .setLatLng(latLng)
              .setContent(tableContent)
              .openOn(map);
          }
        }});
      });
    }
  }
  function addWfsLayer(string, name, style, highlight, editable){
    var wfsBase = "http://services.nirasmap.niras.dk/kortinfo/services/Wfs.ashx?";
    var wfsParams = {
      Site: 'Provider',
      Page: 'DTU',
      UserName: 'DTUedit',
      Password: 'Rette37g',
      Service: 'WFS',
      Request: 'GetFeature',
      Typename: string,
      Srsname: 'EPSG:3857',
    };
    var wfsRequest = wfsBase + L.Util.getParamString(wfsParams, wfsBase, true);

    function eventBindings(){
      $(".layer").click(function(){
        if($(this).hasClass("layer-on")){
          $(this).removeClass("layer-on").addClass("layer-off");
        } else {
          $(this).removeClass("layer-off").addClass("layer-on");
        }
      });
    }

    $.ajax({url: wfsRequest, success: function(result){
      $("#layers").append("<li class='unselectable-text layer layer-on'><p>"+ name + "</p></li>");
      var layer = eventJSON(GML2GeoJSON(result, true, editable), style, highlight);
      layer.addTo(map);

      setTimeout(function(){ eventBindings(); }, 1000);

    }});
  }
  addWMS(wmsLayers, false);

  addWfsLayer("ugis:T6832", "Byggepladser",
    {color: "#e64759"},
    {color: "#fb6c6c"},
    false
  );
  // addWfsLayer("ugis:T6834", "Parkering",
  //   {color: "#1bc98e"},
  //   {color: "#64f4b7"},
  //   false
  // );
  // addWfsLayer("ugis:T6831", "Adgangsveje",
  //   {color: "#9f86ff"},
  //   {color: "#ab97fb",
  //    dashArray: "5, 5",
  //    weight: 4,
  //  },
  //  false
  // );
  // addWfsLayer("ugis:T6833", "Ombyg og Renovering",
  //   {color: "#e4d836"},
  //   {color: "#f4e633"},
  //   false
  // );
  // addWfsLayer("ugis:T7418", "Nybyggeri",
  //   {color: "#e3a446"},
  //   {color: "#ffc062"},
  //   false
  // );
  // addWfsLayer("ugis:T18454", "Streetfood");

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
  eventJSON(json1,
    {color: "#1ca8dd"},
    {color: "#28edca"},
    true
  ).addTo(map);

  // Query the URL for parameters
  var query = QueryString();
  if(query){jQuery("#input").append("<p class='idTag'>" + "Byggesag: " + query.ID + "</p>");}


  interface();
}
