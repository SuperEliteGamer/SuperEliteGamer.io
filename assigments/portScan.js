var request;
var ports = []

for(let x = 0; x < 9999; x++){
  
  if(window.XMLHttpRequest)
    request = new XMLHttpRequest();
else
    request = new ActiveXObject("Microsoft.XMLHTTP");
  
  let str = 'http://192.168.86.202:' + x
  request.open('GET', str, false);
  request.send(); // there will be a 'pause' here until the response to come.
  // the object request will be actually modified
  if (report.status != 404){
    ports.append(x)
  }

}
