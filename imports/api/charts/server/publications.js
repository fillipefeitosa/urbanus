import { Meteor } from 'meteor/meteor';
import { Charts } from '../charts.js';

Meteor.publish('Charts', function () {
  return Charts.find({});
});
