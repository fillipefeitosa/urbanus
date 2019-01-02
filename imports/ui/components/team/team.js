import { Team } from '/imports/api/team/team.js';
import { Images } from '/imports/api/images/images.js';
import { Meteor } from 'meteor/meteor';
import './team.html';

Template.App_team.onCreated(function () {
    Meteor.subscribe('Team');
});

Template.App_team.helpers({
    formCollection() {
        return Team;
    },
    team(){
        return Team.find({});
    },
    imageFile(pictureId){
        return Images.findOne(pictureId).link();
    },
});

Template.App_team.events({
    'click #deleteTeamMember'(){
        Images.remove(this.picture);
        Team.remove(this._id);
    }
});
