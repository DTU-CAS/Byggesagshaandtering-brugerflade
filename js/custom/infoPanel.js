/*
 * This script takes an object and creates a bootstrap editable table
 * Requires: Bootstrap & font-awesome
 * Based upon: Codepen user - Ash Blue
 * Author: NIRAS - Casper Fibæk
 */

 function popUpTable(geoJSON){
   L.featureGroup(L.geoJSON(geoJSON)
     .on('click', function(e){
       var feature = this.getLayers()[0].feature;
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

         $('.table-remove').on('click', function(){
           $(this).parent().remove();
         });

       });

     })
     .addTo(map));
 }

 function addRow(key, attribute, addClass, keyEdit, attrEdit){
   var row =
     "<tr class='table-row'>" +
       "<td contenteditable='" + keyEdit + "'>" + key + "</td>" +
       "<td contenteditable='" + attrEdit + "' " + "class='" + addClass + "'>" + attribute + "</td>" +
       "<td class='table-remove'>" +
         "<i class='fa fa-times' aria-hidden='true'></i>" +
       "</td>" +
     "</tr>";
   return row;
 }

function infoPanel(obj){
  var table =
    "<div id='objTable' class='table-editable'>" +
      "<table class='table'>";

  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
      if(typeof(obj[keys[i]]) === "boolean" || obj[keys[i]] === "true" || obj[keys[i]] === "false"){
        table += addRow(keys[i], obj[keys[i]], "boolean", "false", "true");
      } else if(isNaN(obj[keys[i]]) !== "false"){
        table += addRow(keys[i], obj[keys[i]], "number", "false", "true");
      } else {
        table += addRow(keys[i], obj[keys[i]], "string", "false", "true");
      }
  }

  table +=
        "</table>" +
        "<i class='fa fa-plus table-add' aria-hidden='true'></i>" +
        "</div>";

  return table;
}




/*

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function () {
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
  $TABLE.find('table').append($clone);
});

$('.table-remove').click(function () {
  $(this).parents('tr').detach();
});

$('.table-up').click(function () {
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];

  // Get the headers (add special header logic here)
  $($rows.shift()).find('th:not(:empty)').each(function () {
    headers.push($(this).text().toLowerCase());
  });

  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};

    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();
    });

    data.push(h);
  });

  // Output the result
  $EXPORT.text(JSON.stringify(data));
});
*/
