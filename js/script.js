
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetI = $("#street").val();
    var cityI = $("#city").val();
    var streetView = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + streetI + ", " + cityI;
    
    $greeting.text('So, you want to live at ' + streetI + ", " + cityI + "?");
    
    $body.append('<img class="bgimg" src="' + streetView + '">')

    // YOUR CODE GOES HERE!

    var nyTimesU = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityI + "&sort=newest&api-key=e432e812fe31e103a2350ae1074ec75b:17:72676286";
    $.getJSON(nyTimesU, function(data){
        
        $nytHeaderElem.text("New York Times Articles About " + cityI);

        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++){
            var article = articles[i];
            $nytElem.append('<li class = "article">' + '<a href = "'+article.web_url+'">'+article.headline.main+'</a>'+'<p>' + article.snippet + '</p>' + '</li>');
        };

        console.log(data);
    }).error(function(e) {
    $nytHeaderElem.text("New York Times Articles could not be loaded");
    });

    var wikiU = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityI + "&format=json&callback=wikiCallback";

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiU,
        dataType: "jsonp",
        success: function(response) {

            var articleList = response[1];

            for(var i = 0; i < articleList.length; i++){
                var articleStr = articleList[i];
                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikiElem.append('<li><a href = "'+ url +'">'+articleStr+'</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
            console.log(response);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.49, lng: -30.05},
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  map.set('styles', [
  {
        "featureType": "landscape",
        "stylers": [
            {"hue": "#d4f086"},
            {"visibility": "on"}
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {"saturation": -70},
            {"lightness": 41},
            {"visibility": "simplified"}
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {"saturation": -100},
            {"visibility": "simplified"}
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {"saturation": -100},
            {"lightness": 30},
            {"visibility": "on"}
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {"saturation": -100},
            {"lightness": 40},
            {"visibility": "on"}
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {"saturation": -100},
            {"visibility": "simplified"}
        ]
    },
    {
        "featureType": "administrative.province",
        "stylers": [
            {"visibility": "off"}
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {"visibility": "on"},
            {"lightness": -25},
            {"saturation": -100}
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {"hue": "#8ec3d2"},
            {"lightness": -5},
            {"saturation": -60}
        ]
    }
]);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
}




//function initialize() {
    //var mapCanvas = document.getElementById('map');
    //var mapOptions = {
      //center: new google.maps.LatLng(44.5403, -78.5463),
      //zoom: 8,
     // mapTypeId: google.maps.MapTypeId.ROADMAP
   // }
   // var map = new google.maps.Map(mapCanvas, mapOptions);
//}
//google.maps.event.addDomListener(window, 'load', initialize);