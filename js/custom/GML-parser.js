/*
 * This scripts takes a gml from a wfs call and exports geoJSON
 * Author: NIRAS - Casper Fibæk
 */

function GML2GeoJSON(gml, convert){
  if(convert === true){
    var WGS84Param = proj4("EPSG:4326");
  }

  function getCoord(coordArr, convert, srs){
    var ts = $(coordArr).attr("ts");
    var cs = $(coordArr).attr("cs");
    var decimal = $(coordArr).attr("decimal");
    var arr_init = coordArr.innerHTML;
    var arr_ts = arr_init.split(ts);
    var arr_cs = [];

    if(convert === true){
      var coordinateSystem = proj4(epsg[srs.split(":")[1]]);

      for(var i = 0; i < arr_ts.length; i++){
        arr_cs.push(proj4(coordinateSystem, WGS84Param, [
          Number(arr_ts[i].split(cs)[0]),
          Number(arr_ts[i].split(cs)[1]),
        ]));
      }}
    else {
      for(var j = 0; j < arr_ts.length; j++){
        arr_cs.push([
          Number(arr_ts[j].split(cs)[0]),
          Number(arr_ts[j].split(cs)[1]),
        ]);
      }
    }
    return arr_cs;
  }

  var geoJSON = {
    "type": "FeatureCollection",
    "crs": {
      "properties": {
        "name": $(gml.getElementsByTagName("Box")[0]).attr("srsName")
      },
      "type": "name"
    },
    "features": []
  };

  // Get all elements in featureCollection
  if(gml.children[0].tagName === "FeatureCollection"){
    var geometryArray = gml.getElementsByTagName("featureMember");

    // Loop through geometry
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
        var srs;

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

              if(convert === true){
                srs = $(features[j].children[0]).attr("srsName");
                polyArr.push(getCoord(coords, true, srs));
              } else {
                polyArr.push(getCoord(coords, false));
              }
            }

            if(polygonArr.length === 1){
              obj.geometry.type = "Polygon";
            } else {
              obj.geometry.type = "MultiPolygon";
            }

            obj.geometry.coordinates = polyArr;
          }
          else if (type === "Polygon"){
            poly = features[j].getElementsByTagName("Polygon")[0];
            coords_single = poly.getElementsByTagName("coordinates")[0];
            obj.geometry.type = "Polygon";

            if(convert === true){
              srs = $(poly).attr("srsName");
              obj.geometry.coordinates = [getCoord(coords_single, true, srs)];
            } else {
              obj.geometry.coordinates = [getCoord(coords_single, false)];
            }
          }
        }
      }
      geoJSON.features.push(obj);
    }
 }

  return geoJSON;
}