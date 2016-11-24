function interface(){
  $("#polygons").click(function(){
    $(".selected").removeClass("selected");
      disableEdits();
      map.editTools.startPolygon();
      $(this).addClass("selected");
  });

  $("#lines").click(function(){
    $(".selected").removeClass("selected");
      disableEdits();
      map.editTools.startPolyline();
      $(this).addClass("selected");
  });

  $("#markers").click(function(){
    $(".selected").removeClass("selected");
    disableEdits();
    map.editTools.startMarker();
    $(this).addClass("selected");

    $("#map").one("click", function(){
      disableEdits();
      $(".selected").removeClass("selected");
      $("#map").css("cursor", "inherit");
      console.log("i fired");
    });

  });

  $("#openHide").click(function(){
    if($(this).hasClass("open")){
      $(this)
        .removeClass("open")
        .addClass("closed")
        .empty()
        .append("<i class='fa fa-angle-double-left' aria-hidden='true'></i>")
        .css("background", "#252830;")
        .animate({
          right: "0"
        }, 'fast');

        $("#input").animate({
          width: "0",
          opacity: 0
        }, 'fast');
    } else {
      $(this)
        .removeClass("closed")
        .addClass("open")
        .empty()
        .append("<i class='fa fa-angle-double-right' aria-hidden='true'></i>")
        .animate({
          right: "250px"
        }, 'fast');

        $("#input").animate({
          width: "250",
          opacity: 1
        }, 'fast');
    }
  });

  $("#snapping").click(function(){
    if($(this).hasClass("off")){
      $(this).removeClass("off").addClass("on");
    } else {
      $(this).removeClass("on").addClass("off");
    }
  });

  $(".menu-item").click(function(){
    if(!$(this).hasClass("menu-selected")){
      $(".menu-selected").removeClass("menu-selected");
      $(this).addClass("menu-selected");
      $(".theme").removeClass("main");

      if($(this).is("#menu-view-top")){
        $("#menu-view-main").addClass("main");
      } else if ($(this).is("#menu-edit-top")){
        $("#menu-edit-main").addClass("main");
      } else if ($(this).is("#menu-tools-top")){
        $("#menu-tools-main").addClass("main");
      }
    }

  });

  function enableEdits(){
    map.eachLayer(function(layer){
      // console.log(layer);
      if (layer instanceof L.Path){
        if (typeof layer.editor == 'undefined'){
          if(layer.options.editable !== false){
            layer.enableEdit();
          }
      }}
    });
  }

  function disableEdits(){
    map.editTools.stopDrawing();
    map.eachLayer(function(layer){
      if(layer.editor){
        if(layer.editor._enabled === true){
          layer.toggleEdit();
       }}
    });
  }

  $("#map").keyup(function(e){
    if (e.keyCode === 27) { // esc
      disableEdits();
      $(".selected").removeClass("selected");
    }
  });

  map.on('keypress', function(e) {
    if (e.originalEvent.keyCode === 189){ // ½
       enableEdits();
     } else if (e.originalEvent.keyCode === 49){ // Number: 1
       $("#polygons").click();
     } else if (e.originalEvent.keyCode === 50){ // Number: 2
       $("#lines").click();
     } else if (e.originalEvent.keyCode === 51){ // Number: 3
       $("#markers").click();
     }
  })
    .on('editable:editing', function (e) {
      // e.layer.setStyle({color: 'DarkRed'});
    })
    .on('editable:created', function (e) {
      e.layer.options.editable = true;
      // e.layer.setStyle({color: 'blue'});
    })
    .on('editable:drawing:end', function (e){
      if(e.layer._parts){
        if(e.layer._parts.length > 0){
          var json = e.layer.toGeoJSON();
          json.properties = {"ID": QueryString().ID};
          map.removeLayer(e.layer);
          addLayer = eventJSON(json,
            {color: "#1ca8dd"},
            {color: "#28edca"},
            true
          ).addTo(map);
        }
      }
    });

$(document).dblclick(function() {
  disableEdits();
  $(".selected").removeClass("selected");
});

  var deleteShape = function (e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) this.editor.deleteShapeAt(e.latlng);
  };

  map.on('layeradd', function (e) {
    if (e.layer instanceof L.Path) e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
  });

  if($( window ).width() < 900){
    if($("#openHide").hasClass("open")){
      $("#openHide").click();
    }
  } else if($(window).width() > 900){
    if($("#openHide").hasClass("closed")){
      $("#openHide").click();
    }
  }

}
