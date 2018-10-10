import { Charts } from '/imports/api/charts/charts.js';
import { Meteor } from 'meteor/meteor';
import './charts.html';

Template.App_charts.onCreated(function () {
  Meteor.subscribe('Charts');
});

Template.App_charts.helpers({
    formCollection() {
        return Charts;
    },
    charts(){
        return Charts.find({});
    }
});
