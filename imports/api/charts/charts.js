import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Images } from '../images/images.js';

SimpleSchema.extendOptions(['autoform']);

export const Charts = new Mongo.Collection('Charts');

Charts.allow({
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

ChartsSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Nome do Gráfico',
        max: 30
    },
    available: {
        type: Boolean,
        optional: true,
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

Charts.attachSchema(ChartsSchema);
