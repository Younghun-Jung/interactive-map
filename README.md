# Project Details
</br>

## Introduction

Git hub here - https://github.com/Younghun-Jung/interactive-map </br>

This app displays several popular locations for Seoul trip</br>
It is possible to click on every marker to get more information for each location. </br>
There is a menu on the left side of the app. </br>
There is a search box above the map.

## This app was developed using the following technologies

1. Google maps API
2. Wikipedia API
3. Ajax request (JSON)
4. Js libraries - JQuery, KnockoutJS
5. CSS
6. HTML


## How to use this app?

1. Open index.html in a web browser.
2. By clicking on one of the markers - the marker will start bouncing and an info window will open.
3. Check information(wiki, street view) of specific location
4. By clicking on another marker, the current info window will close and a new info window will open.
5. Every info window includes -
		1. The name of the location.(includeing wiki link)
		2. A description about the location.
		3. Street view panorama
6. On the upper left side there is a menu bar -  
		1. By clicking on it the menu will open.
		2. By clicking again the menu will close.
7. Clicking on any location on the menu will open the info window of this location and the marker will start bouncing.
8. Above the map there is a search box - every search in this box will filter the locations in the menu and the marker on the map according to the search.

## Reference
- Google Maps API:</br>
Google Map API on Udacity course,</br>
https://developers.google.com/maps/documentation/javascript/tutorial
</br>
- Zoom correct:</br>
http://stackoverflow.com/questions/2437683/google-maps-api-v3-can-i-setzoom-after-fitbounds</br>
- Value Binding:</br>
http://knockoutjs.com/documentation/value-binding.html</br>
- Google Maps API > Maps JavaScript API:</br>
https://developers.google.com/maps/documentation/javascript/events?hl=ko</br>
- Explicitly subscribing to observables:</br>
http://knockoutjs.com/documentation/observables.html</br>
- Data-binding</br>
http://knockoutjs.com/documentation/foreach-binding.html</br>
http://knockoutjs.com/documentation/text-binding.html</br>
http://knockoutjs.com/documentation/click-binding.html</br>
JavaScript Design Pattern on Udacity course</br>
- JavaScript indexOf() function; Search character:</br>
http://webisfree.com/blog/?titlequery=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%B0%B0%EC%97%B4-%EB%98%90%EB%8A%94-%EB%AC%B8%EC%9E%90%EC%97%B4%EC%97%90-indexof-%EC%82%AC%EC%9A%A9%ED%95%9C-%ED%8A%B9%EC%A0%95-%EB%AC%B8%EC%9E%90-%EA%B2%80%EC%83%89</br>
- Marker Bounce Animation:</br>
http://secr.tistory.com/94</br>
- CSS Button style:</br>
http://www.w3schools.com/css/css3_buttons.asp</br>
- Wiki URL API Ajax:</br>
Wikipedia API part on Udacity course,</br>
http://api.jquery.com/jquery.ajax/</br>
- Customize Infowindow style:</br>
http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
