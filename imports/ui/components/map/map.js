import { Template } from 'meteor/templating';
import { leaflet } from 'leaflet';

import './map.html';

Template.App_map.helpers({
    create: function(){

    },
    rendered: function(){
        var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    },
    destroyed: function(){

    },
});

Template.App_map.events({
    "click #foo": function(event, template){

    }
});
