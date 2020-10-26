/*
 * Alex Ketavongsa
 * ISTE 252 - Project 3 JS
 */
var tem = "";
var alt = "";
var loca= "";
var weather= "";

/* This method initializes Google Maps and calls all the other methods */
function initMap(){
    var markers = [];    
    navigator.geolocation.getCurrentPosition( onSuccess, onError, { maximumAge: 300000, timeout: 10000, enableHighAccuracy: true } );
            // google.maps.event.addDomListener( window, 'load', onSuccess );
        
        /* When location access is granted, display the map */        
        function onSuccess(position) {
          if (position.coords) {
              let lat = position.coords.latitude,
                  lng = position.coords.longitude,
                  //Google Maps
                  myLatlng = new google.maps.LatLng(lat, lng),
                  mapOptions = {
                      zoom: 7,
                      center: myLatlng,
                      disableDefaultUI: true
                  },
                  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
                  marker = new google.maps.Marker({
                      position: myLatlng,
                      map: map,
                      animation: google.maps.Animation.DROP
                    });
                markers.push(marker);
                document.getElementById("latS").innerHTML = lat;
                document.getElementById("lonS").innerHTML = lng;
                getWeather(lat, lng);
                getHumidity(lat, lng);
                getAlt(myLatlng);
                getGeo(myLatlng);
                google.maps.event.addListener(map, 'click', function(event) {
                    markers[0].setMap(null);
                    markers = [];
                    var latA= event.latLng.lat();
                    var lngA = event.latLng.lng();
                    var latlog = {lat: latA, lng: lngA};
                    time = "";
                    marker = new google.maps.Marker({
                        position: latlog,
                        map: map,
                        animation: google.maps.Animation.DROP
                    });
                    markers.push(marker);
                    document.getElementById("latS").innerHTML = latA;
                    document.getElementById("lonS").innerHTML = lngA;

                    getGeo(latlog);
                    getAlt(latlog);
                    getWeather(latA, lngA);
                    getHumidity(latA, lngA);

              });
            }
        }
        
        /* If user denies location access, display the info for San Francisco (default location) */
        function onError(error) {
            alert('Google Maps does not have access to your location. The default location will be used instead.');
            let lat = 37.759560,
            lng = -122.440689,
            myLatlng = new google.maps.LatLng(lat, lng),
                  mapOptions = {
                      zoom: 11,
                      center: myLatlng,
                      disableDefaultUI: true
                  },
                  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                  marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    animation: google.maps.Animation.DROP
                  });
              markers.push(marker);
                  document.getElementById("latS").innerHTML = lat;
                  document.getElementById("lonS").innerHTML = lng;
                getWeather(lat, lng);
                getHumidity(lat, lng);
                getAlt(myLatlng);
                getGeo(myLatlng);
                google.maps.event.addListener(map, 'click', function(event) {
                  markers[0].setMap(null);
                  markers = [];
                  var latA= event.latLng.lat();
                  var lngA = event.latLng.lng();
                  var latlog = {lat: latA, lng: lngA};
                  time = "";
                  marker = new google.maps.Marker({
                      position: latlog,
                      map: map,
                      animation: google.maps.Animation.DROP
                  });
                  markers.push(marker);
                  document.getElementById("latS").innerHTML = latA;
                  document.getElementById("lonS").innerHTML = lngA;

                  getGeo(latlog);
                  getAlt(latlog);
                  getWeather(latA, lngA);
                  getHumidity(latA, lngA);

            });
        }
    }

/* These functions set the textboxes where the info is displayed using the retrieved values */
function temp(temp) {
    document.getElementById("t").innerHTML = temp;
    }
function alti(alti) {
    document.getElementById("al").innerHTML = alti.toString().substring(0,6) + " meters";
    }
    
function weat(wet) {
    document.getElementById("w").innerHTML = wet;
    }
function humi(hum) {
	document.getElementById("hu").innerHTML = hum;
	}

/* This function calls OpenWeatherMap API to retrieve the current temp value based on user's current location or selected location on the map (using lat/long values) */	
function getWeather(lat, long) {

  var xhr = new XMLHttpRequest();
  var call = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=7aef02e3cb01f3693bd3ab7a807a7e8a";
  xhr.open("GET", call, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        weat(response.main.temp + "°F");
        console.log("Temperature(F): " + response.main.temp);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
};

 /* This function calls OpenWeatherMap API to retrieve humidity value based on user's current location or selected location on the map (using lat/long values) */
 function getHumidity(lat, long) {

  var xhr = new XMLHttpRequest();
  var call = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=7aef02e3cb01f3693bd3ab7a807a7e8a";
  xhr.open("GET", call, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        humi(response.main.humidity + "%");
        console.log("Temperature(F): " + response.main.humidity);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}; 


/* This function calls Google's Geocoder API to retrieve the current address, latitude, and longitude values based on user's current location or selected location on the map (using lat/long values) */
function getGeo(latNlngN) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'latLng': latNlngN
  }, function(results, status) {
    //Checks if eveything is alright
    if (status == google.maps.GeocoderStatus.OK) {
      //gets the first result and adds it in.
      if (results[0]) {
        locN = results[0].formatted_address;
        document.getElementById("locS").innerHTML = locN;
      }
    }
  });
}

 /* This function calls Google's ElevationService API to retrieve the altitude value based on user's current location or selected location on the map (using lat/long values) */ 
 function getAlt(latAlngA) {
  var elevator = new google.maps.ElevationService;
  elevator.getElevationForLocations({
    'locations': [latAlngA]
  }, function(results, status) {
    //Checking to see if everything is functional
    if (status === 'OK') {
      // Gets the first result
      if (results[0]) {
        //Returns the elevation based on the coordinates provided
                alt = results[0].elevation;
                alti(alt);
      } 
    }
  });
}