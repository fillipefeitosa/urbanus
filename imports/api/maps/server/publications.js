import { Meteor } from 'meteor/meteor';
import { Maps } from '../maps.js';

Maps.allowClient();

Meteor.publish("files.maps.all", function(argument){
    return Maps.collection.find({});
});
