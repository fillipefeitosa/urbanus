import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';

FlowRouter.wait();
Tracker.autorun(function(){
    // if the roles subscription is ready, start routing
    // there are specific cases that this reruns, so we also check
    // that FlowRouter hasn't initalized already

    if (Roles.subscription.ready() && !FlowRouter._initialized) {
        return FlowRouter.initialize();
    }
});

Tracker.autorun(function(){
    if (!Meteor.userId()) {
        if (Session.get('loggedIn')) {
            // get and save the current route
            route = FlowRouter.current();
            Session.set('redirectAfterLogin', route.path);
            FlowRouter.go(FlowRouter.path('login'));
        }
    }
});

// Redirection Routine for user
Accounts.onLogin(function(){
    var redirect;
    redirect = Session.get('redirectAfterLogin');
    if (redirect != null){
        if (redirect !== '/login'){
            return FlowRouter.go(redirect);
        }
    }
    Meteor.logoutOtherClients();
    return Session.set('loggedIn', true);
});
