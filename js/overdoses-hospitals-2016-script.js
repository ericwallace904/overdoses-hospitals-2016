var layer = new L.StamenTileLayer('toner-lite');

var map = new L.Map('map').setView([30.364,-81.652],10);
map.addLayer(layer);

function setColor(overdoses) {
	var overdose_num = parseInt (overdoses);
	var getColor = chroma.scale(['#efedf5', '#756bb1']).domain([0,400]);
	return getColor(overdose_num);
}


function setStyle(feature) {
	return {
		opacity: 1,
		weight: 2,
		color: "#FFF",
		fillColor: setColor(feature.properties.OverdoseZip2016),
		fillOpacity: 0.8
	}
}

var geojson;

function highlightFeature(e) {
	var layer = e.target;
	od_info.update(layer.feature.properties);
}

function resetHighlight(e) {
	// geojson.resetStyle(e.target);
	od_info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature,layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

var od_info = L.control();

od_info.onAdd = function (map) {
	this._div = L.DomUtil.create('div','od_info');
	this.update();
	return this._div;
};

od_info.update = function (props) {
	this._div.innerHTML = '<h4>Overdoses in 2016:</h4>' + (props ? 
		'<b>ZIP Code ' + props.GEOID10 + '</b><br />' + props.OverdoseZip2016 + ' overdoses' : 'Hover over a ZIP code');
};

od_info.addTo(map);
	
L.geoJson(duval_zip, {
	style: setStyle,
	onEachFeature: onEachFeature
}).addTo(map);

for (var num = 0; num < hospitals.length; num++) {
	var hospital = hospitals[num];
	var hospital_lat = hospital["Latitude"];
	var hospital_long = hospital["Longitude"];
	var hospital_name = hospital["Hospital"];
	var hospital_address = hospital["HospitalStreetAddress"];
	var hospital_city = hospital["HospitalCity"];
	var hospital_ods = hospital["NumberOverdoses"];
	
	var marker = L.marker([hospital_lat,hospital_long]).addTo(map);
	
	var popup_html = '<h3>' + hospital_name + '</h3>';
	popup_html += '<div>' + hospital_address + ', ' + hospital_city + '</div>';
	popup_html += '<div><strong>Overdoses in 2016:</strong> ' + hospital_ods + '</div>';
	
	marker.bindPopup(popup_html);
}