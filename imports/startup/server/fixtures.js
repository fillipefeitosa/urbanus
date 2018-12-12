// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';

Meteor.startup(() => {
    // Set Conf for autoform-files <https://github.com/VeliovGroup/meteor-autoform-file>
    SimpleSchema.setDefaultMessages({
        initialLanguage: 'en',
        messages: {
            en: {
                uploadError: '{{value}}', //File-upload
            },
        }
    });
    // If the Roles collection is empty
    var roles = Meteor.roles.find({}).count();
    if (roles > 0) {
        console.log("Roles Defined. Default Behavior.");
    } else {
        Roles.createRole('Convidado');
        Roles.createRole('Colaborador');
        Roles.createRole('Administrador');
    }
    // Make new user as 'Convidado role'
    Accounts.onCreateUser(function(options, user){
        user.roles = ['Convidado'];
        return user;
    });
    // if the Links collection is empty
    if (Links.find().count() === 0) {
        const data = [
            {
                title: 'Do the Tutorial',
                url: 'https://www.meteor.com/try',
                createdAt: new Date(),
            },
            {
                title: 'Follow the Guide',
                url: 'http://guide.meteor.com',
                createdAt: new Date(),
            },
            {
                title: 'Read the Docs',
                url: 'https://docs.meteor.com',
                createdAt: new Date(),
            },
            {
                title: 'Discussions',
                url: 'https://forums.meteor.com',
                createdAt: new Date(),
            },
        ];

        data.forEach(link => Links.insert(link));
    }
});
