import { Template } from 'meteor/templating';
import { Maps } from '/imports/api/maps/maps.js';
import { HTTP } from 'meteor/http';
import { ReactiveVar } from 'meteor/reactive-var';
import './map.html';
import './map-components/map-options.js';

// Resets and populates a leaflet map
populateMap = function(geoJsonLink, map){
    $.getJSON(geoJsonLink, function(data){
        // console.log(data);
        L.geoJSON(data).addTo(map);
    });
}
generateMap = function(mapDiv){
    var container = L.DomUtil.get('map');
    if(container!=null){
        container._leaflet_id = null;
    }
    var map = L.map(mapDiv, {
        doubleClickZoom: false
    }).setView([40.5542,-8.6854], 13);
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    }).addTo(map);
    return map;
}

// App_map General Page
Template.App_map.onRendered(function(){
    Meteor.subscribe("files.maps.all");
    $('.selectpicker').selectpicker();
});

Template.mapDropdown.helpers({
    mapCollection(){
        return Maps.find({});
    }
});

// Map Dropdown Component
Template.mapDropdown.onCreated(function(){
    this.autorun(()=>{
        this.subscribe('files.maps.all');
    })
})

Template.mapDropdown.events({
    "change #mapSelector": function(event, template){
        event.preventDefault();
        // Jquery way to get Multiple Values
        // var values = $('#mapSelector').val();

        // Pure JS way to return values from multiple selector
        const selected = document.querySelectorAll('#mapSelector option:checked');
        const values = Array.from(selected).map(el=>el.value);

        var selectedMaps = Maps.find({ _id : { $in: values }});
        // Initiate Map
        viewMap = generateMap('map');
        // Populate maps for all the data
        selectedMaps.forEach((map)=>{
            populateMap(Maps.findOne(map._id).link(), viewMap);
        })


        // generateMap(myMap.link(), 'map');
    }
});

// Map Upload templating
Template.mapUploadForm.onCreated(function(){
    this.currentUpload = new ReactiveVar(false);
})

Template.mapUploadForm.helpers({
    currentUpload() {
        return Template.instance().currentUpload.get();
    }
});

Template.mapUploadForm.events({
    'change #fileInput'(e, template){
        if(e.currentTarget.files && e.currentTarget.files[0]){
            const upload = Maps.insert({
                file: e.currentTarget.files[0],
                streams: 'dynamic',
                chunkSize: 'dynamic'
            }, false);

            upload.on('start', function(){
                template.currentUpload.set(this);
            });

            upload.on('end', function(error, fileObj){
                if(error){
                    alert('Erro ao carregar: ' + error);
                } else {
                    alert('Ficheiro Carregado com sucesso!');
                }
                template.currentUpload.set(false);
            });

            upload.start();
        }
    }
});
