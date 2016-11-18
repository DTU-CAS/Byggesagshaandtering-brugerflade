function interface(){
  $("#polygons").click(function(){
    if($(this).hasClass("selected")){
      disableEdits();
      $(".selected").removeClass("selected");
    } else {
      disableEdits();
      map.editTools.startPolygon();
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  $("#lines").click(function(){
    if($(this).hasClass("selected")){
      disableEdits();
      $(".selected").removeClass("selected");
    } else {
      disableEdits();
      map.editTools.startPolyline();
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  $("#markers").click(function(){
    if($(this).hasClass("selected")){
      disableEdits();
      $(".selected").removeClass("selected");
    } else {
      map.editTools.startMarker();
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
    }
  });

  $("#snapping").click(function(){
    if($(this).hasClass("off")){
      $(this).removeClass("off").addClass("on");
    } else {
      $(this).removeClass("on").addClass("off");
    }
  });

  function enableEdits(){
    map.eachLayer(function(layer){
      if (layer instanceof L.Path){
        if (typeof layer.editor == 'undefined'){
          layer.enableEdit();
      }}
    });
  }

  function disableEdits(){
    map.eachLayer(function(layer){
      if(layer.editor){
        if(layer.editor._enabled === true){
          layer.toggleEdit();
       }}
    });
  }

  $("#map").on('keydown', function(e) {
     if (e.keyCode === 27) { // esc
       disableEdits();
       $(".selected").removeClass("selected");
     } else if (e.keyCode === 220){ // ½
       enableEdits();
     } else if (e.keyCode === 49){ // Number: 1
       $("#polygons").click();
     } else if (e.keyCode === 50){ // Number: 2
       $("#lines").click();
     } else if (e.keyCode === 51){ // Number: 3
       $("#markers").click();
     }
  }).dblclick(function() {
    disableEdits();
    $(".selected").removeClass("selected");
  });

  var deleteShape = function (e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) this.editor.deleteShapeAt(e.latlng);
  };

  map.on('layeradd', function (e) {
    if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
  });


}
