import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Images } from '../images/images.js';

SimpleSchema.extendOptions(['autoform']);

export const Team = new Mongo.Collection('Team');

Team.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

TeamSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Nome",
        max: 200
    },
    formation: {
        type: String,
        label: 'Formação',
        max: 100
    },
    link: {
        type: String,
        label: "Link",
        max: 200
    },
    picture: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                // uploadTemplate: 'uploadField', // <- Optional
                // previewTemplate: 'uploadPreview', // <- Optional
                insertConfig: { // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
                    meta: {},
                    isBase64: false,
                    transport: 'ddp',
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    allowWebWorkers: true
                }
            }
        }
    }

});

Team.attachSchema(TeamSchema);
