var SeeModal = function() {
    var main = this;
    this.mapNotLoaded = ko.observable(false);
    this.placesList = ko.observableArray([]);//we are initialising placeslist observable array
    places.forEach(function(thatplace) {
    main.placesList.push(new space(thatplace));});
    map.fitBounds(map.bounds);//it will fit the map to the new bounds
    this.presentLoc = ko.observable(placesList()[0]);//initialing the present locations
    this.keyWord = ko.observable('');//we are intialising the keyword which is used to filter the results when entered a keyword
    this.backOriginalState = function() { // this is used to get back to original state
        main.presentLoc().active(false);
        main.presentLoc().pinpoint.setAnimation(null);
        popupWindow.close();};
    this.pureLocations = ko.computed(function() {
    backOriginalState();
    return main.placesList().filter(function(thatplace) {// it will show the filtered locations by keyword
            var show = true;
            if (main.keyWord() !== '') {// check if place name contains the keyword
                var a = thatplace.placeid().toLowerCase().indexOf(main.keyWord().toLowerCase());
                if (a !== -1) {
                    show = true;
                } else {
                    show = false;}}
            thatplace.pinpoint.setVisible(show);
            return show;});});
    this.selectPlace = function(whenClicked) {
        var m =  main.presentLoc().active() === true;
        if (main.presentLoc() == whenClicked && m) {
            backOriginalState();
            return;
        }backOriginalState();//it will reset to original state

        main.presentLoc(whenClicked);

        main.presentLoc().active(true);

        main.presentLoc().pinpoint.setAnimation(google.maps.Animation.BOUNCE);//it will add animation to marker
        popupWindow.setContent('<h1>' + main.presentLoc().placeid() + '</h1>' + main.presentLoc().getContent(function(i) {
            var d = main.presentLoc();
            if (d == i) {
                popupWindow.setContent('<h1>' + main.presentLoc().placeid() + '</h1>' + i.data());
            }}));
        popupWindow.open(map, main.presentLoc().pinpoint);//it will open a popupwindow when marker clicked
         map.panTo(main.presentLoc().pinpoint.position);};};
