import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Session } from 'meteor/session';

// Import needed layouts
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/header/header.js';
import '../../ui/layouts/footer/footer.js';
import '../../ui/layouts/clean-body/clean-body.js';
import '../../ui/layouts/vega-header/vega-header.js';

// Import needed pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/about/about.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/login/login.js';
import '../../ui/pages/landing/landing.js';

// Set up all routes in the app


// Public (exposed) routes
exposed = FlowRouter.group({});
exposed.route('/landing', {
    name: 'landing',
    action: function(){
        BlazeLayout.render('App_body', {top: "header", main: "landing"});
    }
})
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

// Exposed Visualization Views
exposed.route('/charts/view-chart/:chartId', {
    action: function(params, queryParams){
        console.log('I am on the chart:', params.chartId);
        // BlazeLayout.render('App_body', {top: "header", main: "App_home", pageContent:"App_team"});
        BlazeLayout.render('App_body', {top: "vega-header", main: "clean-body" });
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
});

loggedIn.route('/charts', {
    name: 'charts',
    action: function(){
        BlazeLayout.render('App_body', { top: "header", main: "App_home", pageContent:"App_charts"});
    }
});

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
