function interface(){
  map.on('pm:create', function(e) {
    var feature = e.layer;

    feature.setStyle({color: "#21bde7"});
    e.layer.properties = {
      "editMe": true
    };

    feature.on('click', function(e){
      var latLng = e.latlng;

      L.popup()
      .setLatLng(latLng)
      .setContent(infoPanel(feature.properties))
      .openOn(map);

      $('.table-remove').on('click', function(){
        $(this).parent().remove();
      });

      $('.table-add').on('click', function(){
        $(".table > tbody").append(addRow("unNames", "editMe", "string", "true", "true"));

        $('.table-remove > i').on('click', function(){
          $(this).parent().parent().remove();
        });

      });
    })

    .on('mouseover', function(e){
     feature.setStyle({color: "#28edca"});
    })
    .on('mouseout', function(e){
     feature.setStyle({color: "#21bde7"});
    });

    map.pm.disableDraw('Poly');
    map.pm.disableDraw('Line');

    $(".enabled").removeClass("enabled").addClass("disabled");
    $(".selected").removeClass("selected");
    $(".unselectable").removeClass("unselectable");

    if(feature.pm.enabled() === true){
      $("#editGeom").removeClass("disabled-edit").addClass("enabled-edit");
      $("#editGeom").first().text("Save edits");
    }

     $("#editGeom").click(function(e){
       console.log(feature);
       if($(this).hasClass("disabled-edit")){
         feature.pm.enable(options);
         $(this).removeClass("disabled-edit").addClass("enabled-edit");
         $(this).first().text("Save edits");
       } else {
         feature.pm.disable();
         $(this).removeClass("enabled-edit").addClass("disabled-edit");
         $(this).first().text("Edit Geometry");
       }
     });

     $("#deleteGeom").click(function(){
       console.log("bob");
       map.removeLayer(feature);
       map.closePopup();
     });
  });

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
      map.pm.enableDraw('Poly', options);
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#lines").addClass("unselectable");
    } else {
      map.pm.disableDraw('Poly');
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#lines").removeClass("unselectable");
    }
  });

  $("#lines").click(function(){
    if($(this).hasClass("disabled")){
      map.pm.enableDraw('Line', options);
      $("#editButtons > div").removeClass("selected");
      $(this).removeClass("disabled").addClass("enabled").addClass("selected");
      $("#polygons").addClass("unselectable");
    } else {
      map.pm.disableDraw('Line');
      $(this).removeClass("enabled").removeClass("selected").addClass("disabled");
      $("#polygons").removeClass("unselectable");
    }
  });


}
