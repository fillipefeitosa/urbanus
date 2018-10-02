import { Meteor } from 'meteor/meteor';
import { Team } from '../team.js';

Meteor.publish('Team', function () {
  return Team.find({});
});
