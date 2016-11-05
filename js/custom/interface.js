function interface(){
  geometry.eachLayer(function(layer) {
      layer.on('click', function(){

        var geoKey = Object.keys(this._layers);
        var geoStyle = this._layers[Number(geoKey)].options;
        var geoFeature = this._layers[Number(geoKey)].feature;
        var geoProperties = geoFeature.properties;

        // jQuery("#attr").html(infoPanel(geoProperties));
      });
  });
}
