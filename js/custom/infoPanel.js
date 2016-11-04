function infoPanel(obj){
  var table = "<table>";
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
      table += "<tr><td>" + keys[i] + "</td>";
      if(typeof(obj[keys[i]]) === "number"){
        table += "<td class='number'>" +  obj[keys[i]] + "</td></tr>";
      } else if(obj[keys[i]] === "boolean" || obj[keys[i]] === "true" || obj[keys[i]] === "false"){
        table += "<td class='boolean'>" +  obj[keys[i]] + "</td></tr>";
      } else {
        table += "<td>" +  obj[keys[i]] + "</td></tr>";
      }
  }
  return table;
}
