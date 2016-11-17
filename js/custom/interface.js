function interface(){
  var options = {
      templineStyle: {
          color: 'red',
      },
      hintlineStyle: {
          color: 'red',
          dashArray: [5, 5],
      },
  };

  $("#polygons").click(function(){
    if($(this).hasClass("disabled")){
      // map.pm.enableDraw('Poly', options);
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#lines").addClass("unselectable");
    } else {
      // map.pm.disableDraw('Poly');
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#lines").removeClass("unselectable");
    }
  });

  $("#lines").click(function(){
    if($(this).hasClass("disabled")){
      map.editTools.startPolyline();
      // map.pm.enableDraw('Line', options);
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#polygons").addClass("unselectable");
    } else {
      // map.pm.disableDraw('Line');
      map.editTools.commitDrawing();
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#polygons").removeClass("unselectable");
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
