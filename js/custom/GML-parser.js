/*
 * This scripts takes a gml from a wfs call and exports geoJSON
 * Author: NIRAS - Casper Fibæk
 */

function GML2GeoJSON(gml, convert){
  // bounding box
  function getBbox(gml, convert){
    var box = gml.getElementsByTagName("Box")[0];
    var srs = $(box).attr("srsName");
    var tag_coordinates = box.getElementsByTagName("coordinates")[0];
    var ts = $(tag_coordinates).attr("ts");
    var cs = $(tag_coordinates).attr("cs");
    var decimal = $(tag_coordinates).attr("ts");
    var bbox_string = tag_coordinates.innerHTML;
    southWest = [];
    northEast = [];

    if(convert === true){
      var coordinateSystem = proj4(epsg[srs.split(":")[1]]);
      var WGS84Param = proj4("EPSG:4326");

      var sw = [
        Number(bbox_string.split(ts)[0].split(cs)[0]),
        Number(bbox_string.split(ts)[0].split(cs)[1])
      ];
      southWest = proj4(coordinateSystem, WGS84Param, sw).reverse();

      var ne = [
        Number(bbox_string.split(ts)[1].split(cs)[0]),
        Number(bbox_string.split(ts)[1].split(cs)[1])
      ];
      northEast = proj4(coordinateSystem, WGS84Param, ne).reverse();

      L.marker(northEast).addTo(map);
      L.marker(southWest).addTo(map);

    } else {
      southWest.push(Number(bbox_string.split(ts)[0].split(cs)[0]));
      southWest.push(Number(bbox_string.split(ts)[0].split(cs)[1]));
      northEast.push(Number(bbox_string.split(ts)[1].split(cs)[0]));
      northEast.push(Number(bbox_string.split(ts)[1].split(cs)[1]));
    }
    return [southWest, northEast];
  }
  function getCoord(coordArr, convert, srs){
    var ts = $(coordArr).attr("ts");
    var cs = $(coordArr).attr("cs");
    var decimal = $(coordArr).attr("decimal");
    var arr_init = coordArr.innerHTML;
    var arr_ts = arr_init.split(ts);
    var arr_cs = [];

    // opti
    for(var i = 0; i < arr_ts.length; i++){
      if(convert === true){
        var coordinateSystem = proj4(epsg[srs.split(":")[1]]);
        var WGS84Param = proj4("EPSG:4326");

        arr_cs.push(proj4(coordinateSystem, WGS84Param, [
          Number(arr_ts[i].split(cs)[0]),
          Number(arr_ts[i].split(cs)[1]),
        ]).reverse());
      } else {
        arr_cs.push([
          Number(arr_ts[i].split(cs)[0]),
          Number(arr_ts[i].split(cs)[1]),
        ]);
      }
    }

    return arr_cs;
  }

  var geoJSON = {
    "type": "FeatureCollection",
    "bbox": getBbox(gml, convert),
    "features": []
  };

  // Get all elements in featureCollection
  if(gml.children[0].tagName === "FeatureCollection"){
    var geometryArray = gml.getElementsByTagName("featureMember");

    // Loop through geometry
    // TODO: check if length is > 1
    for(var i = 0; i < geometryArray.length; i++){
      var features = geometryArray[i].children[0].children;
      var obj = {
        "type": "Feature",
        "properties": {
          "fid": $(geometryArray[i].children[0]).attr("fid")
        },
        "geometry": {}
      };

      // add properties
      for(var j = 0; j < features.length; j++){
        var key = features[j].tagName.split(":")[1];

        // if it is a property add it
        if(key !== "CG_GEOMETRY"){
          obj.properties[key] = features[j].innerHTML;
        } else {  // if it is a geometry merge it
          var type = features[j].children[0].tagName.split(":")[1];

          if(type === "MultiPolygon"){
            var polyArr = [];
            // get all polygons
            var polygonArr = features[j].getElementsByTagName("Polygon");
            // loop through them and add to feature
            for(var q = 0; q < polygonArr.length; q++){
              var coords = polygonArr[q].getElementsByTagName("coordinates")[0];
              polyArr.push(getCoord(coords, true, $(gml.getElementsByTagName("Box")[0]).attr("srsName")));
            }

            obj.geometry.type = "MultiPolygon";
            obj.geometry.coordinates = polyArr;

          } else if (type === "Polygon"){
            var coords_single = features[j].getElementsByTagName("Polygon")[0];
            obj.geometry.type = "Polygon";
            obj.geometry.coordinates = getCoord(coords_single, true, $(gml.getElementsByTagName("Box")[0]).attr("srsName"));
          }
        }
      }
      geoJSON.features.push(obj);
    }
 }

  return geoJSON;
}
