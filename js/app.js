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
	},
	{
		title: 'Lotte_World',
		location: {lat: 37.511380, lng: 127.098210}
	},
	{
		title: 'Olympic_Park,_Seoul',
		location: {lat: 37.520968, lng: 127.121526}
	},
	{
		title: 'Deoksugung',
		location: {lat: 37.566137, lng: 126.975146}
	},
	{
		title: 'Namdaemun',
		location: {lat: 37.560216, lng: 126.975302}
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

	//Set slide in/out on top-bar and menu
	slideBar();
}




// Function for slideBar animation
function slideBar() {
	$('.slideButton').on('click', function() {
		$('.slideBar').toggleClass('slide-out');
		$('.top-bar').toggleClass('right-out');
		//$('#map').toggleClass('right-out');
	})
}

// Function for set Bounce on marker
function setBounce(marker, minute) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function () {
		marker.setAnimation(null);
	}, minute * 1000)
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

		// Using Wikipedia AJAX reques
		// Marker's title which is needed to display information
		var loc = marker.title;
		// Wiki URL for request
		var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + loc + '&format=json';
		// Set fail message if wiki request fails
		var wikiRequestTimeout = setTimeout(function() {
			infowindow.setContent("<div>Fail to get wikipedia resources</div>");
			infowindow.open(map, marker);
		}, 8000);

		$.ajax({
			url: wikiURL,
			dataType: "jsonp"
		}).done(function(response) {
			/* Check contents in response array
			//for(var i=0; i<response.length; i++) {console.log("res"+[i]+" : "+response[i]);console.log(response[3][0]);}
			// response[0]: location title, response[1]: location title(none underbar),
			// response[2]: description, response[3][0]: wiki URL for location
			// response[1], response[3] have two-dimensionaly array such as 'Insa-dong'
			*/

			// Location name on wiki
			var name = response[1][0];
			// Description for loccation on wiki
			var description = response[2];
			// Link URL to wiki page
			var linkURL = response[3][0];
			// Insert contents from wiki on infowindow
			infowindow.setContent("<div class='contentName'>" + name + "</div>" +
														"<div class='contentLink'><a target='_blank' href='" + linkURL + "'>link</a>"+ "</div>" +
														"<div class='contentDes'><p>" + description + "</p></div>"
													 );
			infowindow.open(map, marker);
			// Error handling with JSON P
			clearTimeout(wikiRequestTimeout);
		});
	};

	// Define function if title on list is clicked
	this.listClicked = function(loc) {
		var index;
		console.log("clicked location on list: " + loc.title);
		// Find specific location which is matched with marker's title
		for(var i = 0; i<self.markers.length; i++) {
			if(self.markers[i].title === loc.title) {
				index = i;
				break;
			}
		}
		// Set bounce and Display information of location which is clicked on list
		setBounce(self.markers[index], 1.5);
		self.displayInfo(self.markers[index]);
	};

	// Search Keyword, that user wants to get information, value binding
	// Initially blank keyword
	this.keyword = ko.observable('');
	// Set filter function based on user's keyword; callback that is called
	// whenever the notification happens
	this.keyword.subscribe(function(key) {
		// Initialize locations array for filtered keyword from user
		self.locations([]);
		// Filtering locations that matched with keyword from user
		for (var i=0; i<locationList.length; i++) {
			if(locationList[i].title.toLowerCase().indexOf(key.toLowerCase()) >= 0) {
				// Push location(s) object into locations array
				self.locations.push(locationList[i]);
			}
		}
		// If user clicks bounce button, marekr(s) on list is/are bounced
		$('#bounceBotton').on('click', function() {
			//console.log('bounce button');
			// Fined filtered locations of list that matched with all markers
			for (var i=0; i<self.locations().length; i++) {
				for (var j=0; j<self.markers.length; j++) {
					if (self.locations()[i].title === self.markers[j].title) {
						// Set bounce motion on filtered marker(s)
						setBounce(self.markers[j], 1.5);
					}
				}
			}
		})
	});

	// Setting listener on marker
	for(var i=0; i< this.markers.length; i++){
		self.markers[i].addListener('click', function() {
			setBounce(this, 1.5);
			self.displayInfo(this);
		})
	}
}
