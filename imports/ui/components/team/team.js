import { Team } from '/imports/api/team/team.js';
import { Meteor } from 'meteor/meteor';
import './team.html';

Template.App_team.onCreated(function () {
  Meteor.subscribe('Team');
});

Template.App_team.helpers({
    formCollection() {
        return Team;
    },
});
