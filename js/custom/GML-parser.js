/*
 * This scripts takes a gml 2.0 from a wfs call and exports geoJSON
 * Author: NIRAS - Casper Fibæk
 */

function GML2GeoJSON(gml){
  // bounding box
  var srs = $(gml.getElementsByTagName("Box")[0]).attr("srsName");
  var tag_coordinates = gml.getElementsByTagName("coordinates")[0];

  var ts = $(tag_coordinates).attr("ts");
  var cs = $(tag_coordinates).attr("cs");
  var decimal = $(tag_coordinates).attr("ts");
  var bbox_string = tag_coordinates.innerHTML;

  var southWest = [Number(bbox_string.split(ts)[0].split(cs)[0])];
      southWest.push(Number(bbox_string.split(ts)[0].split(cs)[1]));

  var northEast = [Number(bbox_string.split(ts)[1].split(cs)[0])];
      northEast.push(Number(bbox_string.split(ts)[1].split(cs)[1]));

  var bbox = [southWest, northEast];

  var geometryArray = gml.getElementsByTagName("featureMember");
  var geoJSON = [];
  var polygons = [];

  // Loop through geometry
  for(var i = 0; i < geometryArray.length; i++){
    var features = geometryArray[i].children[0].children;
    var geom = features[features.length - 1];
    var geometry = {};
    var properties = {};

    // add properties
    for(var j = 0; j < features.length - 1; j++){
      properties[features[j].tagName.split(":")[1]] = features[j].innerHTML;
    }

    // add geometry
    // might have more than one geom
    for(var k = 0; k < geom.children.length; k++){
      var type = geom.children[k].tagName.split(":")[1];

      if(type === "MultiPolygon"){
        var multiPolygonSRS = $(geom.children[k]).attr("srsName");

        var polygonArr = geom.getElementsByTagName("Polygon");

        for(var q = 0; q < polygonArr.length; q++){
          polygonCoord = polygonArr[q].getElementsByTagName("coordinates")[0];
          var polygon_ts = $(polygonCoord).attr("ts");
          var polygon_cs = $(polygonCoord).attr("cs");
          var polygon_decimal = $(polygonCoord).attr("decimal");
          var polygon_init = polygonCoord.innerHTML;
          var polygon_split_ts = polygon_init.split(polygon_ts);
          var polygon_split_cs = [];

          for(var bob = 0; bob < polygon_split_ts.length; bob++){
            polygon_split_cs.push([
              Number(polygon_split_ts[bob].split(polygon_cs)[0]),
              Number(polygon_split_ts[bob].split(polygon_cs)[1]),
            ]);
          }

          polygons.push(polygon_split_cs);
        }
      }

      if(type === "Polygon"){
        console.log("I am bob!");
      }

    }

    geoJSON.push(properties);
  }

  return [polygons, geoJSON];
}
