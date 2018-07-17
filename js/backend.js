var map;
var popupWindow;
var space = function(thatplace) {
    var main = this;
    main.placeid = ko.observable(thatplace.placeid);
    main.place = ko.observable(thatplace.place);
    main.lat = ko.observable(thatplace.lat);
    main.lng = ko.observable(thatplace.lng);
    main.img = ko.observable(thatplace.img);
    main.active = ko.observable(false);
    //after the below statement ,if main content is already set,return its value
    main.getContent = function(callfunc) {
        if (main.data) {
            return main.data();
        }
        var wikipediaLink = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + main.placeid() +'&format=json&callfunc=wikicallfunc';
        $.ajax({
                url: wikipediaLink,
                dataType: 'jsonp',
            })
            .done(function(wanteddata) {
                var resultData = '';
                var abc1 = typeof wanteddata[1] !== "unknown";
                var abc2 = typeof wanteddata[3] !== "unknown";
                if (wanteddata && abc1 && abc2) {
                        for (var j = 0; j <1; j++) {
                            var a = typeof wanteddata[1][j] !== "unknown";
                            var b = typeof wanteddata[3][j] !== "unknown";
                            if (a && b ) {
                                resultData += '<a href="' + wanteddata[3][j] + '" target="_blank">' + wanteddata[1][j] + '</a><br>';
                            }
                        }
                    }
                if (resultData !== '') {
                    main.data = ko.observable('<h3>Data In Wikipedia for "' + main.placeid() +  '"</h3><p>' + resultData + '</p><h6>You can See ' + main.placeid() +' Below </h6><img style="width:auto;height:200px;" src='  +  main.img() +'>');
                } else {
                    main.data = ko.observable('<h3>Data In Wikipedia for "' + main.placeid() + '"</h3><p>There was a problem reaching wikipedia, sorry =/</p>');
                }
            })
            .fail(function() {
                console.log("Sorry There Is An Error!!");
            })
            .always(function() {
                if (typeof callfunc !== "unknown") {
                    callfunc(main);
                }
            });
             return '<h5>Data In Wikipedia for "' + main.placeid() + '"</h5><p><span class="default"></span></p>';
    };
    main.addPinpoint = (function() {
        //we are creating marker at loaction
        main.pinpoint = new google.maps.Marker({
            position: { lat: main.lat(), lng: main.lng() },
            map: map,
            heading: main.placeid()
        });
    map.bounds.extend(main.pinpoint.position);//extending boundaries 
    main.pinpoint.addListener('click', function() { // adding listener to marker when clicked
            selectPlace(main);
        });
        map.addListener('click', function() { // adding listener to marker when clicked
            popupWindow.close();
        });
    })();
};
function solveError() {
    console.log('Error!!Error!! Map Cannot be Loaded Now');
    $('body').prepend('<p id="errorofmap">We Are Sorry For This ,We Have a Problem with Google API</p>');
}
//these are the places and lat longs which we retrieve in list
var applimain = function() {
    startFunc();
    ko.applyBindings(SeeModal);
};
function startFunc() {
    map = new google.maps.Map(document.getElementById('mapofmine'));// we are loading the map
    map.bounds = new google.maps.LatLngBounds(); //we are initialising the bounds
    popupWindow = new google.maps.InfoWindow({ // we are intialising the new infowindow
    content: ''
    });
    google.maps.event.addListener(popupWindow, 'closeclick', function() {
        backOriginalState();
    });
}
