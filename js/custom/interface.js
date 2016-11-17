function interface(){
  $("#polygons").click(function(){
    if($(this).hasClass("disabled")){
      map.editTools.startPolygon();
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#lines").addClass("unselectable");
      $("#markers").addClass("unselectable");
    } else {
      map.editTools.commitDrawing();
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#lines").removeClass("unselectable");
      $("#markers").removeClass("unselectable");
    }
  });

  $("#lines").click(function(){
    if($(this).hasClass("disabled")){
      map.editTools.startPolyline();
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#polygons").addClass("unselectable");
      $("#markers").addClass("unselectable");
    } else {
      map.editTools.commitDrawing();
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#polygons").removeClass("unselectable");
      $("#markers").removeClass("unselectable");
    }
  });

  $("#markers").click(function(){
    if($(this).hasClass("disabled")){
      // map.editTools.startPolyline();
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#polygons").addClass("unselectable");
      $("#lines").addClass("unselectable");
    } else {
      // map.editTools.commitDrawing();
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#polygons").removeClass("unselectable");
      $("#lines").removeClass("unselectable");
    }
  });

  $("#snapping").click(function(){
    if($(this).hasClass("off")){
      $(this).removeClass("off").addClass("on");
      $(this).children().text("Disable Snapping");
    } else {
      $(this).removeClass("on").addClass("off");
      $(this).children().text("Enable Snapping");
    }
  });

}
