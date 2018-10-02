import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import needed layouts
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/header/header.js';
import '../../ui/layouts/footer/footer.js';

// Import needed pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/login/login.js';

// Set up all routes in the app


// Public (exposed) routes
exposed = FlowRouter.group({});
exposed.route('/login', {
    name: 'login',
    action: function(){
        BlazeLayout.render('login', { top: "header", main: "App_home", pageContent:"info"});
    }
});
exposed.route('/about', {
    name: 'about',
    action: function(){
        BlazeLayout.render('App_body', { top: "header", main: "App_home", pageContent:"App_about"});
    }
});
exposed.route('/team', {
    name: 'team',
    action: function(){
        BlazeLayout.render('App_body', {top: "header", main: "App_home", pageContent:"App_team"});
    }
});

// Regular Routes. Should be Exposed?
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { top:'header', main: 'App_home', pageContent:"App_about" });
  },
});

FlowRouter.route('/links', {
  name: 'links',
  action() {
    BlazeLayout.render('App_body', { top: "header", main: "App_home", pageContent:"info"});
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

// Logged Routes
loggedIn = FlowRouter.group({
    triggersEnter: [
        function(){
            var route;
            if(!(Meteor.loggingIn() || Meteor.userId())){
                route = FlowRouter.current();
                if (route.route.name !== 'login') {
                    // Adicionar Mensagem de Redirecionamento
                    Session.set('redirectAfterLogin',route.path);
                }
                return FlowRouter.go('login');
            }
        }
    ]
});

loggedIn.route('/maps', {
    name: 'maps',
    action: function(){
        BlazeLayout.render('App_body', { top: "header", main: "App_home", pageContent:"App_map"});
    }
});

loggedIn.route('/logout', {
    name: 'logout',
    action: function(){
        Meteor.logout(function(){
            FlowRouter.go(FlowRouter.path('about'));
        });
    }
})

// Admin routes
admin = loggedIn.group({
    prefix: '/admin',
    triggersEnter: [
        function(){
            if(!(Roles.userIsInRole(Meteor.userId(), ['Administrador']))){
                return FlowRouter.go(FlowRouter.path('/'));
            }
        }
    ]
});
