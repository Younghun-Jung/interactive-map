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
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.551374, lng: 126.988280},
		zoom: 13,
		mapTypeControl: false
	});
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	infowindow = new google.maps.InfoWindow({
		content: '<div class="content"></div>'
	});

	// The locationList array is applied to create an array of markers on initialization
	for (var i = 0; i < ViewModel.locations().length; i++){
		var position = locationList[i].location;
		var title = locationList[i].title;
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

		// Execute function for showing markers on map
		showMarkers();

		// Create an onclick event to open the large infowindow at each marker
		marker.addListener('click', function() {
			ViewModel.showMarkerInfo(this, infowindow);
		});

		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

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
	};

	// Slide bar button setting
	$('.sideButton').on('click', function() {
		$('.slide-bar').toggleClass('slide-out');
		$('.top-bar').toggleClass('right-out');
		$('#map').toggleClass('right-out');
	});

	// Execute knockout js
	ko.applyBindings(ViewModel);
	// Activate search filter
	ViewModel.query.subscribe(ViewModel.search);
}

// Make marker Icon
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

// Function for show markers on map
function showMarkers() {
	var bounds = new google.maps.LatLngBounds();

	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}

// Bouncing Marker which are clicked
function markerBounce(marker) {
	if(marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(function() {
			marker.setAnimation(null);
		}, 1500);
	}
}



// MVVM pattern by using Knockout js
var ViewModel = {
	locations: ko.observableArray(locationList),

	locationClicked: function(loc) {
		var index;
		for (var i=0; i< locationList.length; i++) {
			if (locationList[i].title === loc.title) {
				index = i;
			}
		}
		console.log("index: " + index);
		ViewModel.showMarkerInfo(markers[index], infowindow);
	},

	showMarkerInfo: function(marker, infowindow) {
		markerBounce(marker);
		infowindow.open(map, marker);

		var contentHTML;
		var panoHTML = '<div id="pano"></div>';

		var requestedLoc;
		for (var i = 0; i < locationList.length; i++) {
			if (marker.position.lat().toFixed(5) == locationList[i].location.lat.toFixed(5) && marker.position.lng().toFixed(5) == locationList[i].location.lng.toFixed(5)){
				requestedLoc = locationList[i].title;
			}
		}

		// Part of ajax for wiki URL
		var wikiUrl = "https://en.wikipedia.org/w/api.php?callback=?&action=opensearch&limit=20&namespace=0&format=json&search=" + requestedLoc;

		$.ajax({
			url: wikiUrl,
			dataType: "jsonp",
			success: function(response) {
				console.log("$.ajax func");
				// Choose the first argument of obj in response from Wiki
				var articleList = response[1][0]; // Location name in wiki
				var desList = response[2][0]; // Description for location
				var url = response[3][0]; // Wiki url for location
				var wikiContent = $('.content');

				contentHTML = '<a href=' + url + ' target="_blank"><h3 class="content_Title">'+ articleList + '</h3></a><div class="des">' + desList + '</div>';
				$('.content').html(contentHTML);

				// 이렇게 명시적으로 해야 순서대로 실행 됨
				contentHTML = contentHTML + panoHTML;
				var streetViewService = new google.maps.StreetViewService();
				radius = 50;
				streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
			}
		}).fail(function() {
			$('.content').html("Fail to load content");
		})

		function getStreetView(data, status) {
			console.log("contentHTML: " + contentHTML);
			if (status == google.maps.StreetViewStatus.OK) {
				console.log("getStreetView func");
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);

					infowindow.setContent(contentHTML);
					console.log(contentHTML);
					var panoramaOptions = {
						position: nearStreetViewLocation,
						pov: {
							heading: heading,
							pitch: 30
						}
					};
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions);
			} else {
				console.log("fail street view");
				infowindow.setContent(contentHTML);
				//$('#pano').html('No Street Veiw');
				$('#pano').html('<img src="js/img/no-image.jpg" width="300px" height="300px">');
				console.log(contentHTML);
			}
		}
		/* 여기에 선언하게 되면 $.ajax를 먼저 실행함에도 불구하고 아래가 먼저 실행됨
		var streetViewService = new google.maps.StreetViewService();
		radius = 50;
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		*/
	},
	// Search Filter part
	query: ko.observable(''),
	search: function(value){
		console.log("val : " + value);
		ViewModel.locations([]);
		for (var i=0; i<markers.length; i++) {
			markers[i].setMap(null);
		}
		for (var a in locationList) {
			if (locationList[a].title.toLowerCase().indexOf(value.toLowerCase()) >=0) {
				ViewModel.locations.push(locationList[a]);
				markers[a].setMap(map);
			}
		}
	}
}
