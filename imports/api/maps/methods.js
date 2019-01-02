import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Maps } from './maps.js';

Meteor.methods({
    getMapLink:function(mapId){
        validadeId = new SimpleSchema({mapId: { type: String } });
        SimpleSchema.validate(mapId, validadeId, {keys: ["mapId"]});
        console.log(mapId);
        myMap = Maps.collection.find(mapId["mapId"]);
        return myMap;
    }
});
