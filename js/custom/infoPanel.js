/*
 * This script takes an object and creates a bootstrap editable table
 * Requires: Bootstrap & glyphicon-plus
 * Author: NIRAS - Casper Fibæk
 */

function infoPanel(obj){
  var table = "<table>";
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
      table += "<tr><td>" + keys[i] + "</td>";
      if(typeof(obj[keys[i]]) === "number"){
        table += "<td contenteditable='true' class='number'>" +  obj[keys[i]] + "</td></tr>";
      } else if(obj[keys[i]] === "boolean" || obj[keys[i]] === "true" || obj[keys[i]] === "false"){
        table += "<td contenteditable='true' class='boolean'>" +  obj[keys[i]] + "</td></tr>";
      } else {
        table += "<td contenteditable='true'>" +  obj[keys[i]] + "</td></tr>";
      }
  }
  return table;
}

/*
<div class="container">
  <h1>HTML5 Editable Table</h1>
  <p>Through the powers of <strong>contenteditable</strong> and some simple jQuery you can easily create a custom editable table. No need for a robust JavaScript library anymore these days.</p>

  <ul>
    <li>An editable table that exports a hash array. Dynamically compiles rows from headers</li>
    <li>Simple / powerful features such as add row, remove row, move row up/down.</li>
  </ul>

  <div id="table" class="table-editable">
    <span class="table-add glyphicon glyphicon-plus"></span>
    <table class="table">
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
      <tr class="hide">
        <td contenteditable="true">Untitled</td>
        <td contenteditable="true">undefined</td>
        <td>
          <span class="table-remove glyphicon glyphicon-remove"></span>
        </td>
        <td>
          <span class="table-up glyphicon glyphicon-arrow-up"></span>
          <span class="table-down glyphicon glyphicon-arrow-down"></span>
        </td>
      </tr>
    </table>
  </div>

  <button id="export-btn" class="btn btn-primary">Export Data</button>
  <p id="export"></p>
</div>
*/
