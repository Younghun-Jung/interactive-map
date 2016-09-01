var map;
var markers = [];
var infowindow;

// These are the locations list that will be shown to the user.
var locationList = [
	{
		title: 'N_Seoul_Tower',
		location: {lat: 37.551374, lng: 126.988280}
	},
	{
		title: 'Bukchon_Hanok_Village',
		location: {lat: 37.583061, lng: 126.983477}
	},
	{
		title: 'Insa-dong',
		location: {lat: 37.571747, lng: 126.985968}
	},
	{
		title: 'Hongdae,_Seoul',
		location: {lat: 37.553026, lng: 126.924264}
	},
	{
		title: 'Gwangjang_Market',
		location: {lat: 37.570096, lng: 126.999344}
	},
	{
		title: 'Gyeongbokgung',
		location: {lat: 37.579889, lng: 126.976987}
	},
	{
		title: 'Cheonggyecheon',
		location: {lat: 37.571238, lng: 127.024334}
	},
	{
		title: 'Gwanghwamun',
		location: {lat: 37.577627, lng: 126.976944}
	}
];

// Initialization the google map and several functions
function initMap() {
	// Create new map
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.551374, lng: 126.988280},
		zoom: 14,
		mapTypeControl: false
	});

	// Setting marker Icon
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');

	// Setting Infowindow style
	infowindow = new google.maps.InfoWindow();

	// The locationList array is applied to create an array of markers on initialization
	for (var i = 0; i < locationList.length; i++){
		// Assign position and title of all locations into variabels
		var position = locationList[i].location;
		var title = locationList[i].title;

		// Create new markers for all locations
		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: position,
			title: title,
			id: i,
			icon: defaultIcon
		});

		// Push the marekr to array of markers
		markers.push(marker);

		// Marker's color change
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	};

	// Binding View model by passing markers array
	ko.applyBindings(new ViewModel(markers));

	// Remove background margin on infowindow
	google.maps.event.addListener(infowindow, 'domready', function() {
		// Reference to the DIV which receives the contents of the infowindow using jQuery
 		var iwOuter = $('.gm-style-iw');
	    /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
    var iwBackground = iwOuter.prev();
    // Remove the background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    // Remove the white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});
  });

	// Extend the boundaries of the map for each marker, display the marker and correct zoom value
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
	var listener = google.maps.event.addListener(map, "idle", function() {
		if(map.getZoom() > 13) {
			map.setZoom(13);
			google.maps.event.removeListener(listener);
		}
	});

	// Function for Marker Icon setting
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			'|40|_|%E2%80%A2',
			new google.maps.Size(21, 34),
			new google.maps.Point(0, 0),
			new google.maps.Point(10, 34),
			new google.maps.Size(21,34));
		return markerImage;
	}
}

// Function for Marker display on map
function focusMarker(marker) {
	var bounds = new google.maps.LatLngBounds();
	marker.setMap(map);
	bounds.extend(marker.position);
	map.fitBounds(bounds);
	// Correct zoom value
	var listener = google.maps.event.addListener(map, "idle", function() {
		if(map.getZoom() > 20) {
			map.setZoom(15);
			google.maps.event.removeListener(listener);
		}
	});
}

// Function for Marker hide on map
function hideMarker(marker) {

}


// MVVM patter View Model for interaction
var ViewModel = function(markersArray) {
	// Create variable 'self' for different function scope
	var self = this;

	// Assign parameter into variable for ViewModel function
	this.markers = markersArray;

	// Assign locationList to locations which is knockout js func
	this.locations = ko.observableArray(locationList);

	// Display information for specific marker (which is clicked)
	this.displayInfo = function(marker) {
		console.log("title: " + marker.title + " id: " + marker.id);
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
	};

	// Define function if title on list is clicked
	this.listClicked = function() {
		var index;
		// Find specific location which is matched with marker' title
		for(var i = 0; i<markers.length; i++) {
			if(self.locations[i].title === marker.title) {
				index = i;
				break;
			}
		}
		// Display information of location which is clicked on list
		self.displayInfo(self.markers[index]);
	};

	// Setting listener on marker
	for(var i=0; i< this.markers.length; i++){
		self.markers[i].addListener('click', function() {
			self.displayInfo(this);
		})
	}

	


}
/*
var ViewModel = {
	// Assign locationList to locations which is knockout js func
	locations: ko.observableArray(locationList),
	// Define function if specific marker is clicked
	markerClicked: function(marker) {
		var index;
		for(var i = 0; i<markers.length; i++) {
			if(ViewModel.locations()[i].title === marker.title) {
				index = i;
				break;
			}
		}
		console.log("title: " + marker.title + " index: " + index);
		ViewModel.displayInfo(index);
	},
	// Display information for specific marker (which is clicked)
	displayInfo: function(index) {
		infowindow.setContent('<div>' + markers[index].title + '</div>');
		infowindow.open(map, markers[index]);
	}
}
*/
