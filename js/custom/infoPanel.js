/*
 * This script takes an object and creates a bootstrap editable table
 * Requires: Bootstrap & glyphicon
 * Based upon: Codepen user - Ash Blue
 * Author: NIRAS - Casper Fibæk
 */

function infoPanel(obj){
  var table =
    "<div id='objTable' class='table-editable'>" +
      "<span class='table-add glyphicon glyphicon-plus'></span>" +
      "<table class='table'>";

  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
      if(typeof(obj[keys[i]]) === "number"){
        table += addRow(keys[i], obj[keys[i]], "number");
      } else if(obj[keys[i]] === "boolean" || obj[keys[i]] === "true" || obj[keys[i]] === "false"){
        table += addRow(keys[i], obj[keys[i]], "boolean");
      } else {
        table += addRow(keys[i], obj[keys[i]], "string");
      }
  }
  table += "</table></div>";

  function addRow(key, attribute, addClass){
    var row =
      "<tr class='table-row'>" +
        "<td contenteditable='false' " + "class='" + addClass + "'>" + key + "</td>" +
        "<td contenteditable='true'>" + attribute + "</td>" +
        "<td>" +
          "<span class='table-remove glyphicon glyphicon-remove'></span>" +
        "</td>" +
        "<td>" +
          "<span class='table-up glyphicon glyphicon-arrow-up'></span>" +
          "<span class='table-down glyphicon glyphicon-arrow-down'></span>" +
        "</td>" +
      "</tr>";
    return row;
  }

  return table;
}

/*

      <tr>
        <th>Name</th>
        <th>Value</th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <td contenteditable="true">Stir Fry</td>
        <td contenteditable="true">stir-fry</td>
        <td>
          <span class="table-remove glyphicon glyphicon-remove"></span>
        </td>
        <td>
          <span class="table-up glyphicon glyphicon-arrow-up"></span>
          <span class="table-down glyphicon glyphicon-arrow-down"></span>
        </td>
      </tr>
      <!-- This is our clonable table line -->

    </table>
  </div>
*/
