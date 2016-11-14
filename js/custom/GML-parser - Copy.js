/*
 * This scripts takes a gml from a wfs call and exports geoJSON
 * Author: NIRAS - Casper Fibæk
 */

function GML2GeoJSON(gml){
  var geoJSON = [];
  var polygons = [];
  var bbox = getBbox(gml);

  // bounding box
  function getBbox(gml){
    var box = gml.getElementsByTagName("Box")[0];
    var srs = $(box).attr("srsName");
    var tag_coordinates = box.getElementsByTagName("coordinates")[0];
    var ts = $(tag_coordinates).attr("ts");
    var cs = $(tag_coordinates).attr("cs");
    var decimal = $(tag_coordinates).attr("ts");
    var bbox_string = tag_coordinates.innerHTML;
    var southWest = [Number(bbox_string.split(ts)[0].split(cs)[0])];
        southWest.push(Number(bbox_string.split(ts)[0].split(cs)[1]));
    var northEast = [Number(bbox_string.split(ts)[1].split(cs)[0])];
        northEast.push(Number(bbox_string.split(ts)[1].split(cs)[1]));
    return [southWest, northEast];
  }
  function getCoord(coordArr){
    var ts = $(coordArr).attr("ts");
    var cs = $(coordArr).attr("cs");
    var decimal = $(coordArr).attr("decimal");
    var arr_init = coordArr.innerHTML;
    var arr_ts = arr_init.split(ts);
    var arr_cs = [];

    for(var i = 0; i < arr_ts.length; i++){
      arr_cs.push([
        Number(arr_ts[i].split(cs)[0]),
        Number(arr_ts[i].split(cs)[1]),
      ]);
    }

    return arr_cs;
  }

  // Get all elements in featureCollection
  if(gml.children[0].tagName === "FeatureCollection"){
    var geometryArray = gml.getElementsByTagName("featureMember");

    // Loop through geometry
    for(var i = 0; i < geometryArray.length; i++){
      var features = geometryArray[i].children[0].children;
      var fid = $(geometryArray[i].children[0]).attr("fid");
      var properties = {};
      var geometry = {};

      // add properties
      for(var j = 0; j < features.length; j++){
        var key = features[j].tagName.split(":")[1];

        // if it is a property add it
        if(key !== "CG_GEOMETRY"){
          properties[key] = features[j].innerHTML;
        } else {  // if it is a geometry merge it
          var geom = features[j];
          var type = geom.children[0].tagName.split(":")[1];

          if(type === "MultiPolygon"){
            // get all polygons
            var polygonArr = geom.getElementsByTagName("Polygon");
            // loop through them and add to geom
            for(var q = 0; q < polygonArr.length; q++){
              var polygonCoord = polygonArr[q].getElementsByTagName("coordinates")[0];
              polygons.push(getCoord(polygonCoord));
            }

          } else if (type === "Polygon"){
            polygons.push(getCoord(geom.getElementsByTagName("Polygon")[0]));
          }
        }
      }
      geoJSON.push(properties);
    }
 }

  return [polygons, geoJSON, bbox];
}
