import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { AutoForm } from 'meteor/aldeed:autoform';

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
        max: 60
    },
    link: {
        type: String,
        label: "Link",
        max: 200
    }

});

Team.attachSchema(TeamSchema);
