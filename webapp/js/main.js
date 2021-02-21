async function populateGraph(){
	var data = [
  		{	
    		x: ['3 Hours Ago', '2 Hours Ago', '1 Hour Ago', 'This Hour'],
    		y: [3, 4, 1, 6],
    		type: 'bar'
  		}
	];
	Plotly.newPlot('reportstimechart', data);
}


async function populateReports(){
	var apikey = getCookie("apikey");
	var reports = await $.get(`https://skweez.firebaseio.com/reports.json?auth=${apikey}`).then(data => {return data;});
	var devices = await $.get(`https://skweez.firebaseio.com/devices.json?auth=${apikey}`).then(data => {return data;});
	for (var key in reports){
		var timestamp = new Date(parseInt(reports[key]["timestamp"]));
		var deviceID = reports[key]["device"];
		var userID = devices[deviceID]["associated-user"];
		var user = await $.get(`https://skweez.firebaseio.com/users/${userID}.json?auth=${apikey}`).then(data => {return data;});
		var userName = user["name"];

		$("#reportsbody").append(`<tr><th scope='row'>${timestamp.toUTCString()}</th><td>${userName}</td></tr>`);
	}
}

async function populateDevices(){
	var apikey = getCookie("apikey");
	var devices = await $.get(`https://skweez.firebaseio.com/devices.json?auth=${apikey}`);

	for(var key in devices){
		var user = await $.get(`https://skweez.firebaseio.com/users/${devices[key]["associated-user"]}.json?auth=${apikey}`).then(data => {return data;});
		var userName = user["name"];

		$("#devicesbody").append(`<tr><th scope='row'>${devices[key]["nickname"]}</th><td>${userName}</td></tr>`);
	}
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
	  c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
	  return c.substring(name.length, c.length);
	}
  }
  return "";
}

async function populateConfig(){
	var apikey = getCookie("apikey");
	var config = await $.get(`https://skweez.firebaseio.com/config.json?auth=${apikey}`);
	$("#alertemail").val(config["alert-email"]);

}

async function setConfig(){
	var apikey = getCookie("apikey");

	$.ajax({
		contentType: 'application/json',
		url: `https://skweez.firebaseio.com/config.json?auth=${apikey}`,
		type: 'PATCH',
		data: JSON.stringify({"alert-email": `${$("#alertemail").val()}`}),
		success: function(){
			$("#configfail").hide();
			$("#configtrue").show();
		},
		error: function(){
			$("#configfail").show();
			$("#configtrue").hide();
		}
	});
}

async function queryRecentReports(){
	var apikey = getCookie("apikey");
}

window.onload = function() {
	populateDevices();
	populateConfig();
	populateReports();
	populateGraph();
}