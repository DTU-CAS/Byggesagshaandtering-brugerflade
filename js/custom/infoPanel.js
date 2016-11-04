function infoPanel(obj){
  var table = "<table>";
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
      table += "<tr><td>" + keys[i] + "</td>" + "<td>" +  obj[keys[i]] + "</td></tr>";
      console.log(keys[i] + ": " + obj[keys[i]]);
  }
  return table;
}
